'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  createAdminProduct,
  getAdminMlInsights,
  getAdminOrders,
  getProducts,
  updateAdminOrderStatus,
} from '@/lib/api/client';
import type { AdminMlInsights, OrderResult, Product } from '@/lib/types';
import { Brain, ChartBar, Database, RefreshCw, Truck } from 'lucide-react';

const ORDER_STATUSES = ['confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered'] as const;
const DEMAND_SERIES_COLORS = ['#ea580c', '#0284c7', '#16a34a', '#7c3aed', '#db2777', '#d97706'];

type ProductForm = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge: string;
  featured: boolean;
};

const INITIAL_FORM: ProductForm = {
  name: '',
  category: '',
  price: '',
  image: '',
  description: '',
  badge: '',
  featured: false,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function AdminPage() {
  const [insights, setInsights] = useState<AdminMlInsights | null>(null);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [statusDraft, setStatusDraft] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [error, setError] = useState('');
  const [productMsg, setProductMsg] = useState('');

  const loadAll = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    const [nextInsights, nextOrders, nextProducts] = await Promise.all([
      getAdminMlInsights({ days: 7, limit: 10, refresh: forceRefresh }),
      getAdminOrders(),
      getProducts(),
    ]);

    if (!nextInsights) {
      setError('Unable to load admin insights. Ensure backend is running.');
    }

    setInsights(nextInsights);
    setOrders(nextOrders);
    setCatalogProducts(nextProducts);
    setStatusDraft(Object.fromEntries(nextOrders.map((item) => [item.orderId, item.status])));

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadAll(false);
  }, []);

  const priceMap = useMemo(() => {
    return Object.fromEntries(catalogProducts.map((product) => [product.id, product.price]));
  }, [catalogProducts]);

  const bestSellerChart = useMemo(() => {
    if (!insights) return [];
    return insights.bestSellers.slice(0, 8).map((item) => ({
      name: item.productName.length > 14 ? `${item.productName.slice(0, 14)}...` : item.productName,
      units: item.totalUnits,
    }));
  }, [insights]);

  const demandProductSeries = useMemo(() => {
    if (!insights) return [];
    return insights.demand.forecasts.slice(0, 6).map((forecast, index) => ({
      key: `p_${forecast.productId}`,
      productName: forecast.productName,
      color: DEMAND_SERIES_COLORS[index % DEMAND_SERIES_COLORS.length],
      forecast,
    }));
  }, [insights]);

  const demandByProductChartData = useMemo(() => {
    if (demandProductSeries.length === 0) {
      return [];
    }

    const byDate = new Map<string, Record<string, string | number>>();
    demandProductSeries.forEach((series) => {
      series.forecast.nextDays.forEach((point) => {
        if (!byDate.has(point.date)) {
          byDate.set(point.date, {
            dateKey: point.date,
            date: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          });
        }
        byDate.get(point.date)![series.key] = point.predictedUnits;
      });
    });

    return [...byDate.values()].sort((a, b) => String(a.dateKey).localeCompare(String(b.dateKey)));
  }, [demandProductSeries]);

  const priceRecommendations = useMemo(() => {
    if (!insights) return [];

    return insights.demand.forecasts.slice(0, 10).map((forecast) => {
      const base = insights.bestSellers.find((seller) => seller.productId === forecast.productId);
      const historicalDaily = base?.last30DaysUnits
        ? base.last30DaysUnits / 30
        : base?.avgDailyUnits || forecast.avgDailyPrediction;

      const rawDeltaPct = historicalDaily > 0
        ? ((forecast.avgDailyPrediction - historicalDaily) / historicalDaily) * 100
        : 0;

      const bandSpan = Math.max(0, forecast.demandConfidenceBand.high - forecast.demandConfidenceBand.low);
      const uncertaintyRatio = forecast.predictedPeriodTotal > 0
        ? Math.min(1, bandSpan / (2 * forecast.predictedPeriodTotal))
        : 1;

      const confidenceScore = Math.round((1 - uncertaintyRatio) * 100);
      const confidenceFactor = 0.5 + (confidenceScore / 100) * 0.5;
      const adjustedDeltaPct = rawDeltaPct * confidenceFactor;

      let action: 'Increase' | 'Decrease' | 'Keep' = 'Keep';
      let recommendationPct = 0;

      if (adjustedDeltaPct >= 8) {
        action = 'Increase';
        recommendationPct = clamp(Math.round(adjustedDeltaPct * 0.28), 3, 10);
      } else if (adjustedDeltaPct <= -8) {
        action = 'Decrease';
        recommendationPct = clamp(Math.round(adjustedDeltaPct * 0.28), -10, -3);
      }

      const currentPrice =
        priceMap[forecast.productId] ||
        Math.max(1, Math.round((base?.totalRevenue || 0) / Math.max(1, base?.totalUnits || 1)));

      const nextPrice = Math.max(1, Math.round(currentPrice * (1 + recommendationPct / 100)));

      const reason = action === 'Keep'
        ? 'Predicted demand is close to the recent baseline, so price can stay stable.'
        : `Predicted demand is ${adjustedDeltaPct.toFixed(1)}% ${action === 'Increase' ? 'above' : 'below'} baseline with confidence ${confidenceScore}%.`;

      return {
        productId: forecast.productId,
        productName: forecast.productName,
        historicalDaily: Number(historicalDaily.toFixed(1)),
        forecastDaily: Number(forecast.avgDailyPrediction.toFixed(1)),
        currentPrice,
        action,
        recommendationPct,
        nextPrice,
        adjustedDeltaPct: Number(adjustedDeltaPct.toFixed(1)),
        confidenceScore,
        reason,
      };
    });
  }, [insights, priceMap]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductMsg('');

    if (!form.name.trim() || !form.category.trim() || !form.price || !form.image.trim() || !form.description.trim()) {
      setProductMsg('Please fill all required product fields.');
      return;
    }

    setSavingProduct(true);

    const result = await createAdminProduct({
      name: form.name.trim(),
      category: form.category.trim().toLowerCase(),
      price: Number(form.price),
      image: form.image.trim(),
      description: form.description.trim(),
      badge: form.badge.trim(),
      featured: form.featured,
    });

    setSavingProduct(false);

    if (!result) {
      setProductMsg('Unable to add product right now.');
      return;
    }

    setForm(INITIAL_FORM);
    setProductMsg(`Product added: ${result.product.name}`);
    await loadAll(true);
  };

  const handleStatusUpdate = async (orderId: string) => {
    const nextStatus = statusDraft[orderId] || orders.find((order) => order.orderId === orderId)?.status;
    if (!nextStatus) {
      return;
    }

    const updated = await updateAdminOrderStatus(orderId, nextStatus);
    if (!updated) {
      return;
    }

    setOrders((prev) => prev.map((item) => (item.orderId === orderId ? updated.order : item)));
    setStatusDraft((prev) => ({ ...prev, [orderId]: updated.order.status }));
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 text-foreground/70">Loading admin dashboard...</div>
      </main>
    );
  }

  if (!insights) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">
          <p>{error || 'Unable to load admin analytics data.'}</p>
          <button
            onClick={() => void loadAll(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Control Center</h1>
            <p className="mt-2 max-w-3xl text-sm text-foreground/70 md:text-base">
              Add products, monitor best sellers, review ML demand prediction, optimize prices, confirm orders, and guide tracking.
            </p>
            <p className="mt-2 text-xs text-foreground/60">
              Source mode: <span className="font-semibold text-foreground">{insights.dataset.mode || 'unknown'}</span>
              {insights.dataset.filePath ? ` | CSV: ${insights.dataset.filePath}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="w-fit rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
              Last trained: {new Date(insights.generatedAt).toLocaleString()}
            </Badge>
            <button
              onClick={() => void loadAll(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-sm text-foreground/60">Dataset Records</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Database className="h-6 w-6 text-primary" />
            {insights.dataset.records.toLocaleString()}
          </div>
          <p className="mt-2 text-xs text-foreground/60">{insights.dataset.source}</p>
        </article>

        <article className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-sm text-foreground/60">Model Quality (R2)</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Brain className="h-6 w-6 text-primary" />
            {insights.model.r2.toFixed(3)}
          </div>
          <p className="mt-2 text-xs text-foreground/60">MAE: {insights.model.mae.toFixed(2)} | RMSE: {insights.model.rmse.toFixed(2)}</p>
        </article>

        <article className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-sm text-foreground/60">Top Forecasted Product</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ChartBar className="h-6 w-6 text-primary" />
            {insights.demand.topDemandProducts[0]?.productName || 'N/A'}
          </div>
          <p className="mt-2 text-xs text-foreground/60">7-day demand: {insights.demand.topDemandProducts[0]?.predictedPeriodTotal ?? 0} units</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6">
        <article className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Best Seller Graph</h2>
          <p className="mt-1 text-sm text-foreground/60">Top products by units sold</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellerChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="units" fill="#c2410c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Demand by Product (Graph)</h2>
          <p className="mt-1 text-sm text-foreground/60">Each top product in a separate forecast line</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandByProductChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {demandProductSeries.map((series) => (
                  <Line
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={2}
                    name={series.productName}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Demand by Product (Listing)</h2>
          <p className="mt-1 text-sm text-foreground/60">Per-product next 7-day forecast breakdown</p>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {demandProductSeries.map((series) => (
              <div key={series.key} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{series.productName}</p>
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: `${series.color}20`, color: series.color }}>
                    {series.forecast.predictedPeriodTotal} units
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/70">
                  Avg/day: {series.forecast.avgDailyPrediction.toFixed(1)} | Confidence band: {series.forecast.demandConfidenceBand.low} - {series.forecast.demandConfidenceBand.high}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {series.forecast.nextDays.map((point) => (
                    <span key={`${series.key}_${point.date}`} className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80">
                      {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {point.predictedUnits}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">Price Increase / Decrease Recommendation</h2>
        <p className="mt-1 text-sm text-foreground/60">Compares forecast vs recent 30-day demand and adjusts by confidence</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-foreground/60">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Demand Shift</th>
                <th className="py-2 pr-3">Confidence</th>
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Current Price</th>
                <th className="py-2 pr-3">Recommended Price</th>
                <th className="py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {priceRecommendations.map((row) => (
                <tr key={row.productId} className="border-b border-border/40 align-top">
                  <td className="py-3 pr-3 font-medium text-foreground">{row.productName}</td>
                  <td className="py-3 pr-3 text-foreground">
                    {row.adjustedDeltaPct.toFixed(1)}%<br />
                    <span className="text-xs text-foreground/60">{row.historicalDaily} to {row.forecastDaily} units/day</span>
                  </td>
                  <td className="py-3 pr-3 text-foreground">{row.confidenceScore}%</td>
                  <td className="py-3 pr-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.action === 'Increase'
                        ? 'bg-emerald-100 text-emerald-700'
                        : row.action === 'Decrease'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {row.action} {row.recommendationPct ? `(${row.recommendationPct > 0 ? '+' : ''}${row.recommendationPct}%)` : ''}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-foreground">₹{row.currentPrice}</td>
                  <td className="py-3 pr-3 font-semibold text-foreground">₹{row.nextPrice}</td>
                  <td className="py-3 text-xs text-foreground/70">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Add Product</h2>
          <p className="mt-1 text-sm text-foreground/60">Create new products directly from admin panel</p>

          <form onSubmit={handleCreateProduct} className="mt-4 grid grid-cols-1 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Product name"
              className="rounded-lg border border-border bg-background px-3 py-2.5"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Category (e.g. pastries)"
                className="rounded-lg border border-border bg-background px-3 py-2.5"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="Price"
                className="rounded-lg border border-border bg-background px-3 py-2.5"
              />
            </div>
            <input
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="Image URL"
              className="rounded-lg border border-border bg-background px-3 py-2.5"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Description"
              className="rounded-lg border border-border bg-background px-3 py-2.5"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.badge}
                onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="Badge (optional)"
                className="rounded-lg border border-border bg-background px-3 py-2.5"
              />
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                />
                Featured product
              </label>
            </div>

            {productMsg ? <p className="text-sm text-primary">{productMsg}</p> : null}

            <button
              type="submit"
              disabled={savingProduct}
              className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {savingProduct ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Order Confirm + Track Guide</h2>
          <p className="mt-1 text-sm text-foreground/60">Confirm order status updates and share direct tracking links</p>

          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {orders.map((order) => (
              <div key={order.orderId} className="rounded-lg border border-border/50 p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{order.orderId}</p>
                      <p className="text-xs text-foreground/60">{order.customerName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={statusDraft[order.orderId] || order.status}
                        onChange={(e) => setStatusDraft((prev) => ({ ...prev, [order.orderId]: e.target.value }))}
                        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => void handleStatusUpdate(order.orderId)}
                        className="rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-primary-foreground hover:opacity-90"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/order-tracking?orderId=${encodeURIComponent(order.orderId)}`}
                    className="w-fit rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Open customer tracking page
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Tracking guide: customers can open Track Order in the footer, pick their order card from the recent list, or use the direct link shared from this panel.
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-foreground/70">
            <Truck className="h-4 w-4 text-primary" />
            Route pattern: /order-tracking?orderId=...
          </div>
        </article>
      </section>
    </main>
  );
}
