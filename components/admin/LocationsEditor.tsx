"use client";

import { useMemo, useState, useTransition } from "react";
import { createLocation, updateLocation } from "@/app/admin/actions";

type Row = {
  id: string;
  city: string;
  district: string | null;
  name: string;
  address: string | null;
  service_type: "teaching" | "dropin" | "both";
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
};

function isRow(x: unknown): x is Row {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.city === "string" &&
    typeof r.name === "string"
  );
}

export function LocationsEditor({ rows }: { rows: unknown[] }) {
  const initial = useMemo(
    () =>
      rows.filter(isRow).map((r) => ({
        id: r.id,
        city: r.city ?? "",
        district: r.district ?? "",
        name: r.name ?? "",
        address: r.address ?? "",
        service_type: (r.service_type as Row["service_type"]) ?? "both",
        description: r.description ?? "",
        latitude: r.latitude ?? "",
        longitude: r.longitude ?? "",
        is_active: Boolean(r.is_active),
      })),
    [rows]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const [newCity, setNewCity] = useState("");
  const [newName, setNewName] = useState("");
  const [newServiceType, setNewServiceType] =
    useState<Row["service_type"]>("both");

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateLocation(id, {
        city: row.city,
        district: row.district,
        name: row.name,
        address: row.address,
        service_type: row.service_type,
        description: row.description,
        latitude: row.latitude,
        longitude: row.longitude,
        is_active: row.is_active,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  function create() {
    setStatus(null);
    startTransition(async () => {
      const res = await createLocation({
        city: newCity,
        name: newName,
        service_type: newServiceType,
      });
      setStatus(res.success ? "已新增。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewCity("");
        setNewName("");
        setNewServiceType("both");
      }
    });
  }

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">新增據點</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-white/55">city *</label>
            <input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="桃園市"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/55">name *</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              placeholder="中壢飆球俱樂部"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/55">service_type</label>
            <select
              value={newServiceType}
              onChange={(e) =>
                setNewServiceType(
                  e.target.value === "teaching"
                    ? "teaching"
                    : e.target.value === "dropin"
                      ? "dropin"
                      : "both"
                )
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
            >
              <option value="teaching" className="bg-[#1a1028]">
                teaching
              </option>
              <option value="dropin" className="bg-[#1a1028]">
                dropin
              </option>
              <option value="both" className="bg-[#1a1028]">
                both
              </option>
            </select>
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={create}
          className="mt-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          新增
        </button>
      </section>

      {items.map((row) => (
        <section
          key={row.id}
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                {row.city} {row.district ? `· ${row.district}` : ""} · {row.name}
              </p>
              <p className="mt-1 text-xs text-white/35">id: {row.id}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(row.id)}
              className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              儲存
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-white/55">city *</label>
              <input
                value={row.city}
                onChange={(e) => patch(row.id, { city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">district</label>
              <input
                value={row.district}
                onChange={(e) => patch(row.id, { district: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">name *</label>
              <input
                value={row.name}
                onChange={(e) => patch(row.id, { name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">address</label>
              <input
                value={row.address}
                onChange={(e) => patch(row.id, { address: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">service_type</label>
              <select
                value={row.service_type}
                onChange={(e) =>
                  patch(row.id, {
                    service_type:
                      e.target.value === "teaching"
                        ? "teaching"
                        : e.target.value === "dropin"
                          ? "dropin"
                          : "both",
                  })
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              >
                <option value="teaching" className="bg-[#1a1028]">
                  teaching
                </option>
                <option value="dropin" className="bg-[#1a1028]">
                  dropin
                </option>
                <option value="both" className="bg-[#1a1028]">
                  both
                </option>
              </select>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={row.is_active}
                onChange={(e) => patch(row.id, { is_active: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/30 text-brand-purple"
              />
              is_active
            </label>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/55">description</label>
              <textarea
                rows={3}
                value={row.description}
                onChange={(e) => patch(row.id, { description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">latitude</label>
              <input
                value={row.latitude}
                onChange={(e) => patch(row.id, { latitude: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/55">longitude</label>
              <input
                value={row.longitude}
                onChange={(e) => patch(row.id, { longitude: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

