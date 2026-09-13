"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bookmark,
  ChevronRight,
  CircleUserRound,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Sun,
  Wind,
  X,
} from "lucide-react";

type View = "overview" | "favorites" | "profile";
type MetricKey = "temperature" | "humidity" | "wind" | "air";
type WeatherIconName = "sunny" | "partly" | "cloudy" | "rain";

type WeatherDay = {
  day: string;
  date: string;
  condition: string;
  high: number;
  low: number;
  rain: number;
  icon: WeatherIconName;
};

type CityWeather = {
  city: string;
  country: string;
  current: number;
  feels: number;
  condition: string;
  icon: WeatherIconName;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  rain: number;
  aqi: number;
  aqiLabel: string;
  updated: string;
  forecast: WeatherDay[];
  chart: Record<MetricKey, number[]>;
  analysis: string;
};

type Favorite = {
  id?: number;
  city: string;
  country: string;
  label: string;
};

type DashboardProps = {
  user: { displayName: string; email: string } | null;
  signInHref: string;
  signOutHref: string;
};

const CITY_DATA: Record<string, CityWeather> = {
  上海: {
    city: "上海",
    country: "中国",
    current: 24,
    feels: 26,
    condition: "多云间晴",
    icon: "partly",
    high: 28,
    low: 20,
    humidity: 68,
    wind: 3.8,
    rain: 20,
    aqi: 42,
    aqiLabel: "优",
    updated: "刚刚更新",
    chart: {
      temperature: [24, 25, 26, 27, 27, 25, 23],
      humidity: [68, 64, 60, 63, 70, 76, 72],
      wind: [3.8, 4.2, 4.8, 5.1, 4.4, 3.6, 3.2],
      air: [42, 45, 50, 48, 46, 40, 38],
    },
    forecast: [
      { day: "今天", date: "9月13日", condition: "晴间多云", high: 28, low: 20, rain: 20, icon: "partly" },
      { day: "周一", date: "9月14日", condition: "晴朗", high: 29, low: 21, rain: 10, icon: "sunny" },
      { day: "周二", date: "9月15日", condition: "晴朗", high: 30, low: 22, rain: 8, icon: "sunny" },
      { day: "周三", date: "9月16日", condition: "阵雨", high: 27, low: 22, rain: 60, icon: "rain" },
      { day: "周四", date: "9月17日", condition: "小雨", high: 25, low: 21, rain: 70, icon: "rain" },
      { day: "周五", date: "9月18日", condition: "多云", high: 26, low: 20, rain: 32, icon: "cloudy" },
      { day: "周六", date: "9月19日", condition: "晴间多云", high: 28, low: 21, rain: 18, icon: "partly" },
    ],
    analysis: "未来 48 小时气温缓慢上升，周二达到本周高点。周三开始受一股弱冷空气影响，降雨概率明显增加，体感会更凉爽。",
  },
  北京: {
    city: "北京",
    country: "中国",
    current: 22,
    feels: 22,
    condition: "晴朗",
    icon: "sunny",
    high: 27,
    low: 16,
    humidity: 39,
    wind: 2.6,
    rain: 6,
    aqi: 58,
    aqiLabel: "良",
    updated: "刚刚更新",
    chart: {
      temperature: [22, 24, 26, 27, 25, 23, 24],
      humidity: [39, 36, 34, 42, 48, 46, 41],
      wind: [2.6, 2.9, 3.4, 3.8, 4.2, 3.5, 2.8],
      air: [58, 61, 64, 60, 54, 52, 50],
    },
    forecast: [
      { day: "今天", date: "9月13日", condition: "晴朗", high: 27, low: 16, rain: 6, icon: "sunny" },
      { day: "周一", date: "9月14日", condition: "晴朗", high: 28, low: 17, rain: 4, icon: "sunny" },
      { day: "周二", date: "9月15日", condition: "多云", high: 26, low: 18, rain: 18, icon: "cloudy" },
      { day: "周三", date: "9月16日", condition: "多云", high: 25, low: 17, rain: 22, icon: "cloudy" },
      { day: "周四", date: "9月17日", condition: "晴间多云", high: 26, low: 16, rain: 12, icon: "partly" },
      { day: "周五", date: "9月18日", condition: "晴朗", high: 27, low: 17, rain: 8, icon: "sunny" },
      { day: "周六", date: "9月19日", condition: "晴朗", high: 28, low: 18, rain: 7, icon: "sunny" },
    ],
    analysis: "未来一周以晴到多云为主，昼夜温差较大。周一至周二风力略有增强，空气质量维持良好，适合通勤与户外活动。",
  },
  东京: {
    city: "东京",
    country: "日本",
    current: 26,
    feels: 27,
    condition: "局部阵雨",
    icon: "rain",
    high: 29,
    low: 23,
    humidity: 74,
    wind: 4.4,
    rain: 58,
    aqi: 36,
    aqiLabel: "优",
    updated: "刚刚更新",
    chart: {
      temperature: [26, 27, 28, 27, 26, 25, 27],
      humidity: [74, 71, 68, 77, 80, 76, 70],
      wind: [4.4, 4.8, 5.2, 4.6, 4.1, 3.8, 4.3],
      air: [36, 38, 41, 43, 40, 35, 34],
    },
    forecast: [
      { day: "今天", date: "9月13日", condition: "局部阵雨", high: 29, low: 23, rain: 58, icon: "rain" },
      { day: "周一", date: "9月14日", condition: "多云", high: 28, low: 22, rain: 35, icon: "cloudy" },
      { day: "周二", date: "9月15日", condition: "短时阵雨", high: 27, low: 22, rain: 55, icon: "rain" },
      { day: "周三", date: "9月16日", condition: "晴间多云", high: 29, low: 23, rain: 24, icon: "partly" },
      { day: "周四", date: "9月17日", condition: "晴朗", high: 30, low: 23, rain: 12, icon: "sunny" },
      { day: "周五", date: "9月18日", condition: "晴朗", high: 30, low: 24, rain: 10, icon: "sunny" },
      { day: "周六", date: "9月19日", condition: "多云", high: 28, low: 23, rain: 30, icon: "cloudy" },
    ],
    analysis: "前半周湿度偏高，阵雨会在午后短时出现。周三之后天气转稳、气温回升，空气质量保持优，建议随身携带轻便雨具。",
  },
};

const WEATHER_ICONS: Record<WeatherIconName, LucideIcon> = {
  sunny: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
};

const METRICS: Array<{
  key: MetricKey;
  label: string;
  unit: string;
  color: string;
  icon: LucideIcon;
}> = [
  { key: "temperature", label: "温度", unit: "°C", color: "#ffb25f", icon: Sun },
  { key: "humidity", label: "湿度", unit: "%", color: "#8bd7ff", icon: Droplets },
  { key: "wind", label: "风速", unit: "m/s", color: "#adf0da", icon: Wind },
  { key: "air", label: "空气质量", unit: "AQI", color: "#b6b0ff", icon: Activity },
];

function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
  helper,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  tone: string;
  helper: string;
}) {
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between gap-3">
        <span className="metric-icon" style={{ color: tone, backgroundColor: `${tone}16` }}>
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <span className="text-[12px] font-medium text-white/45">{helper}</span>
      </div>
      <div className="mt-7 flex items-baseline gap-1.5">
        <span className="text-[30px] font-semibold tracking-[-0.06em] text-white">{value}</span>
        {unit ? <span className="text-[13px] text-white/50">{unit}</span> : null}
      </div>
      <p className="mt-1 text-[13px] text-white/60">{label}</p>
    </div>
  );
}

export default function WeatherDashboard({ user, signInHref, signOutHref }: DashboardProps) {
  const [view, setView] = useState<View>("overview");
  const [activeCity, setActiveCity] = useState("上海");
  const [metric, setMetric] = useState<MetricKey>("temperature");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [notice, setNotice] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const current = CITY_DATA[activeCity];
  const WeatherIcon = WEATHER_ICONS[current.icon];
  const metricConfig = METRICS.find((item) => item.key === metric) ?? METRICS[0];
  const chartValues = current.chart[metric];
  const chartMin = Math.floor(Math.min(...chartValues) - (metric === "air" ? 5 : 1));
  const chartMax = Math.ceil(Math.max(...chartValues) + (metric === "air" ? 5 : 1));
  const chartWidth = 720;
  const chartHeight = 220;
  const chartPadX = 24;
  const chartPadY = 22;
  const chartPoints = chartValues.map((value, index) => {
    const x = chartPadX + (index * (chartWidth - chartPadX * 2)) / (chartValues.length - 1);
    const y = chartHeight - chartPadY - ((value - chartMin) / (chartMax - chartMin)) * (chartHeight - chartPadY * 2);
    return { x, y, value };
  });
  const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const chartArea = `${chartLine} ${chartWidth - chartPadX},${chartHeight - chartPadY} ${chartPadX},${chartHeight - chartPadY}`;
  const filteredCities = useMemo(
    () => Object.keys(CITY_DATA).filter((city) => city.includes(searchQuery.trim())),
    [searchQuery],
  );
  const isFavorite = favorites.some((favorite) => favorite.city === current.city);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    let active = true;
    fetch("/api/favorites")
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { favorites?: Favorite[] };
      })
      .then((data) => {
        if (active && data?.favorites) setFavorites(data.favorites);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function selectCity(city: string) {
    setActiveCity(city);
    setSearchQuery("");
    setSearchOpen(false);
    setView("overview");
    setMobileNavOpen(false);
  }

  async function toggleFavorite() {
    if (!user) {
      setNotice("登录后即可同步收藏城市");
      return;
    }

    if (isFavorite) {
      const response = await fetch(`/api/favorites?city=${encodeURIComponent(current.city)}`, { method: "DELETE" });
      if (response.ok) {
        setFavorites((items) => items.filter((item) => item.city !== current.city));
        setNotice(`${current.city} 已移出收藏夹`);
      }
      return;
    }

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: current.city,
        country: current.country,
        label: `${current.condition} · ${current.current}°`,
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as { favorite?: Favorite };
      if (data.favorite) setFavorites((items) => [data.favorite as Favorite, ...items]);
      setNotice(`${current.city} 已加入收藏夹`);
    }
  }

  async function removeFavorite(city: string) {
    const response = await fetch(`/api/favorites?city=${encodeURIComponent(city)}`, { method: "DELETE" });
    if (response.ok) {
      setFavorites((items) => items.filter((item) => item.city !== city));
      setNotice(`${city} 已移出收藏夹`);
    }
  }

  function navigate(nextView: View) {
    setView(nextView);
    setMobileNavOpen(false);
  }

  const navItems: Array<{ id: View; label: string; icon: LucideIcon }> = [
    { id: "overview", label: "天气概览", icon: CloudSun },
    { id: "favorites", label: "收藏夹", icon: Bookmark },
    { id: "profile", label: "个人中心", icon: CircleUserRound },
  ];

  return (
    <div className="weather-app min-h-screen text-white">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="weather-sidebar hidden w-[248px] shrink-0 flex-col border-r border-white/10 px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-3">
            <div className="brand-mark"><CloudSun size={21} strokeWidth={1.8} /></div>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.03em]">AURA</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">Weather</p>
            </div>
          </div>

          <nav className="mt-14 space-y-1.5" aria-label="主导航">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Workspace</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button key={item.id} className={`nav-item ${active ? "nav-item-active" : ""}`} onClick={() => navigate(item.id)}>
                  <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                  <span>{item.label}</span>
                  {item.id === "favorites" && favorites.length > 0 ? <span className="ml-auto text-[11px] text-white/40">{favorites.length}</span> : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-[#a7e6ff]">
              <Sparkles size={15} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.13em]">Forecast note</span>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-white/55">今天适合在黄昏时出门，18:00 后体感最舒适。</p>
            <button className="mt-3 flex items-center gap-1 text-[12px] font-medium text-white/80" onClick={() => setNotice("更多建议即将开放")}>更多建议 <ChevronRight size={14} /></button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07131f]/80 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <button className="flex items-center gap-3 lg:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="打开导航">
                <div className="brand-mark small"><CloudSun size={18} /></div>
                <span className="text-[15px] font-semibold tracking-[-0.03em]">AURA</span>
              </button>

              <div className="relative hidden min-w-0 flex-1 sm:block lg:max-w-[370px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={17} />
                <input
                  value={searchQuery}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }}
                  onKeyDown={(event) => { if (event.key === "Enter" && filteredCities[0]) selectCity(filteredCities[0]); }}
                  className="search-input"
                  placeholder="搜索城市"
                  aria-label="搜索城市"
                />
                {searchOpen && (searchQuery || filteredCities.length > 0) ? (
                  <div className="search-menu">
                    {filteredCities.length ? filteredCities.map((city) => (
                      <button key={city} onClick={() => selectCity(city)} className="search-result">
                        <MapPin size={15} />
                        <span>{city}</span>
                        <span className="ml-auto text-[12px] text-white/35">{CITY_DATA[city].current}°</span>
                      </button>
                    )) : <p className="px-4 py-3 text-[13px] text-white/45">暂未收录这座城市</p>}
                  </div>
                ) : null}
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <button className="header-icon" onClick={() => setNotice("暂无新的天气提醒")} aria-label="天气提醒"><BellIcon /></button>
                <span className="hidden h-6 w-px bg-white/10 sm:block" />
                {user ? (
                  <button className="user-chip" onClick={() => navigate("profile")}>
                    <span className="avatar">{user.displayName.slice(0, 1).toUpperCase()}</span>
                    <span className="hidden max-w-[120px] truncate text-[13px] font-medium text-white/78 sm:block">{user.displayName}</span>
                  </button>
                ) : (
                  <a className="login-button" href={signInHref} target="_top"><LogIn size={15} /> 登录 / 注册</a>
                )}
              </div>
            </div>
            {mobileNavOpen ? (
              <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.06] p-2 lg:hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return <button key={item.id} className={`nav-item ${view === item.id ? "nav-item-active" : ""}`} onClick={() => navigate(item.id)}><Icon size={17} /><span>{item.label}</span></button>;
                })}
              </div>
            ) : null}
          </header>

          <div className="mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-8 lg:px-10 lg:pt-10">
            {view === "overview" ? (
              <>
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[13px] text-white/46"><MapPin size={15} /> {current.city} · {current.country} <span className="h-1 w-1 rounded-full bg-[#84dcff]" /> {current.updated}</div>
                    <h1 className="text-[clamp(2rem,4vw,3.55rem)] font-semibold tracking-[-0.07em] text-white">天气，<span className="text-white/42">一目了然。</span></h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`secondary-button ${isFavorite ? "secondary-button-active" : ""}`} onClick={toggleFavorite}><Star size={16} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "已收藏" : "收藏城市"}</button>
                    <button className="icon-button" onClick={() => setNotice("数据每 15 分钟自动刷新")} aria-label="刷新数据"><Settings2 size={17} /></button>
                  </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[1.3fr_.95fr]">
                  <div className="hero-card relative overflow-hidden">
                    <div className="hero-glow hero-glow-one" />
                    <div className="hero-glow hero-glow-two" />
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow">当前天气</p>
                          <div className="mt-3 flex items-center gap-2 text-[15px] text-white/58"><span className="status-dot" />{current.condition}</div>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/48">体感 {current.feels}°</div>
                      </div>
                      <div className="mt-12 flex items-end justify-between gap-5">
                        <div className="flex items-end gap-4">
                          <WeatherIcon className="mb-3 text-[#ffe0a3]" size={84} strokeWidth={1.15} />
                          <div className="flex items-start"><span className="text-[clamp(5rem,10vw,8.6rem)] font-semibold leading-[0.8] tracking-[-0.1em] text-white">{current.current}</span><span className="mt-1 text-3xl font-light text-white/55">°</span></div>
                        </div>
                        <div className="hidden pb-2 text-right sm:block"><p className="text-[13px] text-white/45">今日最高 / 最低</p><p className="mt-2 text-[19px] font-medium text-white/80">{current.high}° <span className="mx-1 text-white/25">/</span> {current.low}°</p></div>
                      </div>
                      <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-[13px] text-white/55">
                        <span className="inline-flex items-center gap-2"><Navigation size={14} className="text-[#99e5ff]" /> 东南风 {current.wind} m/s</span>
                        <span className="inline-flex items-center gap-2"><Droplets size={14} className="text-[#99e5ff]" /> 湿度 {current.humidity}%</span>
                        <span className="inline-flex items-center gap-2"><UmbrellaIcon /> 降雨概率 {current.rain}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="空气质量" value={`${current.aqi}`} unit="AQI" icon={Activity} tone="#b8b0ff" helper={current.aqiLabel} />
                    <MetricCard label="相对湿度" value={`${current.humidity}`} unit="%" icon={Droplets} tone="#8bd7ff" helper="舒适" />
                    <MetricCard label="风速" value={`${current.wind}`} unit="m/s" icon={Wind} tone="#a7f0d9" helper="微风" />
                    <MetricCard label="气压" value="1012" unit="hPa" icon={Gauge} tone="#ffca87" helper="稳定" />
                  </div>
                </section>

                <section className="mt-4 panel p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4"><div><p className="eyebrow">接下来 7 天</p><h2 className="section-title">一周预报</h2></div><button className="quiet-link" onClick={() => setNotice("已为你展示完整 7 天预报")}>查看详情 <ChevronRight size={14} /></button></div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {current.forecast.map((day, index) => {
                      const Icon = WEATHER_ICONS[day.icon];
                      return <div key={day.day} className={`forecast-day ${index === 0 ? "forecast-day-active" : ""}`}><p className="text-[12px] font-medium text-white/72">{day.day}</p><p className="mt-1 text-[11px] text-white/35">{day.date}</p><Icon className="my-5 text-[#ffcf88]" size={25} strokeWidth={1.5} /><p className="text-[12px] text-white/56">{day.condition}</p><div className="mt-3 flex items-center justify-between text-[13px]"><span className="font-semibold text-white">{day.high}°</span><span className="text-white/35">{day.low}°</span></div><div className="mt-3 flex items-center gap-1 text-[11px] text-[#8edbff]"><Droplets size={11} /> {day.rain}%</div></div>;
                    })}
                  </div>
                </section>

                <section className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
                  <div className="panel p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="eyebrow">数据趋势</p><h2 className="section-title">天气指标</h2></div><div className="metric-tabs">{METRICS.map((item) => <button key={item.key} className={`metric-tab ${metric === item.key ? "metric-tab-active" : ""}`} onClick={() => setMetric(item.key)}>{item.label}</button>)}</div></div>
                    <div className="mt-5 flex items-end justify-between"><div><span className="text-3xl font-semibold tracking-[-0.05em] text-white">{metric === "temperature" ? `${current.current}°` : metric === "humidity" ? `${current.humidity}%` : metric === "wind" ? `${current.wind} m/s` : current.aqi}</span><span className="ml-2 text-[13px] text-white/40">当前{metricConfig.label}</span></div><span className="rounded-full bg-[#9ee1ff]/10 px-2.5 py-1 text-[11px] font-medium text-[#9ee1ff]">未来 7 天</span></div>
                    <div className="chart-wrap mt-6"><svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`${metricConfig.label}未来 7 天趋势图`} className="h-auto w-full overflow-visible"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={metricConfig.color} stopOpacity="0.3" /><stop offset="100%" stopColor={metricConfig.color} stopOpacity="0" /></linearGradient></defs>{[0, 1, 2, 3].map((line) => { const y = chartPadY + (line * (chartHeight - chartPadY * 2)) / 3; return <line key={line} x1={chartPadX} x2={chartWidth - chartPadX} y1={y} y2={y} stroke="rgba(255,255,255,.08)" strokeDasharray="3 7" />; })}<polygon points={chartArea} fill="url(#chart-fill)" /><polyline points={chartLine} fill="none" stroke={metricConfig.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{chartPoints.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r="5" fill="#0a1825" stroke={metricConfig.color} strokeWidth="2.5" /><text x={point.x} y={chartHeight + 2} fill="rgba(255,255,255,.38)" fontSize="11" textAnchor="middle">{current.forecast[index].day.replace("今天", "今")}</text></g>)}</svg></div>
                  </div>
                  <div className="analysis-card"><div className="flex items-center gap-3"><div className="analysis-icon"><Sparkles size={18} /></div><div><p className="eyebrow">AURA 分析</p><h2 className="section-title">天气走势</h2></div></div><p className="mt-7 text-[15px] leading-7 text-white/68">{current.analysis}</p><div className="mt-7 space-y-3 border-t border-white/10 pt-5"><div className="flex items-center justify-between text-[13px]"><span className="text-white/45">温度趋势</span><span className="inline-flex items-center gap-1 font-medium text-[#ffcf88]"><ArrowUp size={14} /> 先升后降</span></div><div className="flex items-center justify-between text-[13px]"><span className="text-white/45">空气质量</span><span className="inline-flex items-center gap-1 font-medium text-[#a9f0d9]"><ArrowDown size={14} /> 稳定良好</span></div><div className="flex items-center justify-between text-[13px]"><span className="text-white/45">适宜活动</span><span className="font-medium text-white/78">傍晚散步</span></div></div><button className="mt-8 flex items-center gap-1 text-[13px] font-medium text-[#9ee1ff]" onClick={() => setNotice("已根据未来 7 天数据生成建议")}>查看完整分析 <ChevronRight size={15} /></button></div>
                </section>
              </>
            ) : view === "favorites" ? (
              <FavoritesView user={user} favorites={favorites} onRemove={removeFavorite} onExplore={() => navigate("overview")} signInHref={signInHref} />
            ) : (
              <ProfileView user={user} signInHref={signInHref} signOutHref={signOutHref} onFavorites={() => navigate("favorites")} />
            )}
          </div>
        </main>
      </div>
      {notice ? <div className="toast"><span className="status-dot" />{notice}<button onClick={() => setNotice("")} aria-label="关闭提示"><X size={14} /></button></div> : null}
    </div>
  );
}

function FavoritesView({
  user,
  favorites,
  onRemove,
  onExplore,
  signInHref,
}: {
  user: DashboardProps["user"];
  favorites: Favorite[];
  onRemove: (city: string) => void;
  onExplore: () => void;
  signInHref: string;
}) {
  return <div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Your places</p><h1 className="page-title">收藏夹</h1><p className="mt-3 text-[14px] text-white/45">保存你经常关注的城市，天气变化随时可见。</p></div><button className="secondary-button" onClick={onExplore}><Plus size={16} /> 添加城市</button></div>{!user ? <AccountGate title="登录后管理你的收藏" copy="收藏会与账号同步，在不同设备上也能快速查看。" href={signInHref} /> : favorites.length === 0 ? <div className="empty-state"><Bookmark size={30} /><h2 className="mt-5 text-xl font-semibold tracking-[-0.04em]">收藏夹还是空的</h2><p className="mt-2 text-[14px] text-white/45">在天气概览里点击星标，把常用城市放在这里。</p><button className="primary-button mt-6" onClick={onExplore}>去添加城市 <ChevronRight size={15} /></button></div> : <div className="grid gap-3 sm:grid-cols-2">{favorites.map((favorite) => { const data = CITY_DATA[favorite.city] ?? CITY_DATA.上海; const Icon = WEATHER_ICONS[data.icon]; return <div key={favorite.city} className="favorite-card"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="favorite-icon"><Icon size={23} /></div><div><p className="font-medium text-white">{favorite.city}</p><p className="mt-1 text-[12px] text-white/38">{favorite.country} · {favorite.label}</p></div></div><button className="icon-button subtle" onClick={() => onRemove(favorite.city)} aria-label={`移除${favorite.city}`}><X size={16} /></button></div><div className="mt-8 flex items-end gap-3"><span className="text-4xl font-semibold tracking-[-0.07em]">{data.current}°</span><span className="mb-1 text-[13px] text-white/45">{data.condition}</span></div><div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-[12px] text-white/45"><span className="inline-flex items-center gap-1"><Droplets size={13} /> {data.humidity}%</span><span className="inline-flex items-center gap-1"><Wind size={13} /> {data.wind} m/s</span><span className="ml-auto text-[#9ee1ff]">AQI {data.aqi}</span></div></div>; })}</div>}</div>;
}

function ProfileView({ user, signInHref, signOutHref, onFavorites }: { user: DashboardProps["user"]; signInHref: string; signOutHref: string; onFavorites: () => void }) {
  return <div><div className="mb-8"><p className="eyebrow">Account</p><h1 className="page-title">个人中心</h1><p className="mt-3 text-[14px] text-white/45">管理你的账号与天气偏好。</p></div>{user ? <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="profile-card"><div className="flex items-center gap-4"><div className="profile-avatar">{user.displayName.slice(0, 1).toUpperCase()}</div><div><h2 className="text-xl font-semibold tracking-[-0.04em]">{user.displayName}</h2><p className="mt-1 text-[13px] text-white/45">{user.email}</p></div></div><div className="mt-10 grid gap-3 sm:grid-cols-2"><div className="profile-stat"><span>账号状态</span><strong><span className="status-dot" /> 已登录</strong></div><div className="profile-stat"><span>数据同步</span><strong>已开启</strong></div></div><a className="secondary-button mt-7 inline-flex" href={signOutHref} target="_top"><LogOut size={15} /> 退出登录</a></div><div className="panel p-6"><div className="analysis-icon"><Heart size={18} /></div><h2 className="mt-5 text-xl font-semibold tracking-[-0.04em]">你的天气空间</h2><p className="mt-3 text-[14px] leading-6 text-white/48">收藏城市会跟随你的账号同步。回到收藏夹，快速查看每一个重要地点。</p><button className="quiet-link mt-7" onClick={onFavorites}>查看收藏夹 <ChevronRight size={14} /></button></div></div> : <AccountGate title="登录或注册 AURA" copy="使用 ChatGPT 账号登录，收藏夹和个人设置会自动同步。" href={signInHref} />}</div>;
}

function AccountGate({ title, copy, href }: { title: string; copy: string; href: string }) {
  return <div className="account-gate"><div className="profile-avatar"><CircleUserRound size={27} strokeWidth={1.5} /></div><h2 className="mt-6 text-2xl font-semibold tracking-[-0.05em]">{title}</h2><p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-white/48">{copy}</p><a className="primary-button mt-7 inline-flex" href={href} target="_top"><LogIn size={16} /> 登录 / 注册</a></div>;
}

function BellIcon() {
  return <span className="relative"><span className="bell-shape" /><span className="bell-dot" /></span>;
}

function UmbrellaIcon() {
  return <span className="umbrella-shape" aria-hidden="true" />;
}
