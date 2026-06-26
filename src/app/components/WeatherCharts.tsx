"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  humidity: number;
  wind: number;
  windDeg: number;
  windGust: number;
  windDirection: string;
  icon: string;
  isToday: boolean;
}

interface WeatherChartsProps {
  forecast: ForecastDay[];
  formatDate: (dateStr: string, isToday: boolean) => string;
}

export function TemperatureChart({ forecast, formatDate }: WeatherChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecast}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string, index: number) => formatDate(value, forecast[index].isToday)}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" unit="°C" />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
            formatter={(value: any) => [`${value}°C`, "Temperatura"]}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
          />
          <Area
            type="monotone"
            dataKey="tempMax"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="tempMin"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="none"
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WindChart({ forecast, formatDate }: WeatherChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string, index: number) => formatDate(value, forecast[index].isToday)}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" unit=" m/s" />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Bar dataKey="wind" name="Viento promedio" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="windGust" name="Ráfagas máximas" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}