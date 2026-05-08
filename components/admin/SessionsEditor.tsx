"use client";

import { useMemo, useState, useTransition } from "react";
import { createSession, updateSession } from "@/app/admin/actions";

type LocationOption = {
  id: string;
  city: string;
  district: string | null;
  name: string;
  is_active: boolean;
};

type SessionRow = {
  id: string;
  location_id: string;
  title: string | null;
  session_type: "dropin" | "teaching" | "training";
  weekday: string | null;
  start_time: string | null;
  end_time: string | null;
  level_min: number | null;
  level_max: number | null;
  shuttlecock: string | null;
  price: string | null;
  capacity: number | null;
  is_active: boolean;
};

type EditableSession = {
  id: string;
  location_id: string;
  title: string;
  session_type: SessionRow["session_type"];
  weekday: string;
  start_time: string;
  end_time: string;
  level_min: number | "";
  level_max: number | "";
  shuttlecock: string;
  price: string;
  capacity: number | "";
  is_active: boolean;
};

function isLocation(x: unknown): x is LocationOption {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.name === "string";
}

function isSession(x: unknown): x is SessionRow {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.id === "string" && typeof r.location_id === "string";
}

function toNumOrEmpty(v: string): number | "" {
  const t = v.trim();
  if (!t) return "";
  const n = Number(t);
  return Number.isFinite(n) ? n : "";
}

function renderMaybeEmpty(v: number | "" | null | undefined): string {
  return v === "" || v == null ? "" : String(v);
}

export function SessionsEditor({
  sessions,
  locations,
}: {
  sessions: unknown[];
  locations: unknown[];
}) {
  const locs = useMemo(() => locations.filter(isLocation), [locations]);

  const initial = useMemo(
    () =>
      sessions.filter(isSession).map((s): EditableSession => ({
        id: s.id,
        location_id: s.location_id,
        title: s.title ?? "",
        session_type: s.session_type ?? "dropin",
        weekday: s.weekday ?? "",
        start_time: s.start_time ?? "",
        end_time: s.end_time ?? "",
        level_min: s.level_min ?? "",
        level_max: s.level_max ?? "",
        shuttlecock: s.shuttlecock ?? "",
        price: s.price ?? "",
        capacity: s.capacity ?? "",
        is_active: Boolean(s.is_active),
      })),
    [sessions]
  );

  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const [newLocationId, setNewLocationId] = useState("");
  const [newType, setNewType] = useState<SessionRow["session_type"]>("dropin");

  function patch(id: string, next: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
  }

  function save(id: string) {
    setStatus(null);
    const row = items.find((x) => x.id === id);
    if (!row) return;
    startTransition(async () => {
      const res = await updateSession(id, {
        location_id: row.location_id,
        title: row.title,
        session_type: row.session_type,
        weekday: row.weekday,
        start_time: row.start_time,
        end_time: row.end_time,
        level_min: row.level_min,
        level_max: row.level_max,
        shuttlecock: row.shuttlecock,
        price: row.price,
        capacity: row.capacity,
        is_active: row.is_active,
      });
      setStatus(res.success ? "已儲存。" : `儲存失敗：${res.error}`);
    });
  }

  function create() {
    setStatus(null);
    startTransition(async () => {
      const res = await createSession({
        location_id: newLocationId,
        session_type: newType,
      });
      setStatus(res.success ? "已新增。" : `新增失敗：${res.error}`);
      if (res.success) {
        setNewLocationId("");
        setNewType("dropin");
      }
    });
  }

  const locLabel = (id: string) => {
    const l = locs.find((x) => x.id === id);
    if (!l) return "（未知據點）";
    return `${l.city}${l.district ? ` ${l.district}` : ""} · ${l.name}${
      l.is_active ? "" : "（停用）"
    }`;
  };

  return (
    <div className="space-y-4">
      {status ? (
        <div className="rounded-xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-4 py-3 text-sm text-[#6F5A46]">
          {status}
        </div>
      ) : null}

      <section className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
        <h2 className="text-lg font-semibold text-[#3A2A1E]">新增場次</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#8B735C]">
              location_id *
            </label>
            <select
              value={newLocationId}
              onChange={(e) => setNewLocationId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            >
              <option value="" disabled>
                請選擇據點
              </option>
              {locs.map((l) => (
                <option key={l.id} value={l.id}>
                  {locLabel(l.id)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8B735C]">
              session_type *
            </label>
            <select
              value={newType}
              onChange={(e) =>
                setNewType(
                  e.target.value === "teaching"
                    ? "teaching"
                    : e.target.value === "training"
                      ? "training"
                      : "dropin"
                )
              }
              className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
            >
              <option value="dropin">dropin</option>
              <option value="teaching">teaching</option>
              <option value="training">training</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={create}
          className="mt-5 rounded-xl bg-[#5A3E2B] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
        >
          新增
        </button>
      </section>

      {items.map((row) => (
        <section
          key={row.id}
          className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-6 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
                {row.session_type} · {locLabel(row.location_id)}
              </p>
              <p className="mt-1 text-xs text-[#8B735C]">id: {row.id}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(row.id)}
              className="rounded-xl bg-[#5A3E2B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(90,62,43,0.22)] transition hover:bg-[#6B4A34] disabled:opacity-60"
            >
              儲存
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#8B735C]">
                location_id *
              </label>
              <select
                value={row.location_id}
                onChange={(e) => patch(row.id, { location_id: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              >
                {locs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {locLabel(l.id)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8B735C]">
                session_type
              </label>
              <select
                value={row.session_type}
                onChange={(e) =>
                  patch(row.id, {
                    session_type:
                      e.target.value === "teaching"
                        ? "teaching"
                        : e.target.value === "training"
                          ? "training"
                          : "dropin",
                  })
                }
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm font-semibold text-[#3A2A1E] outline-none focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              >
                <option value="dropin">dropin</option>
                <option value="teaching">teaching</option>
                <option value="training">training</option>
              </select>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(214,168,108,0.10)] px-4 py-3 text-sm font-semibold text-[#5A3E2B]">
              <input
                type="checkbox"
                checked={row.is_active}
                onChange={(e) => patch(row.id, { is_active: e.target.checked })}
                className="h-4 w-4 rounded border-[rgba(90,62,43,0.22)] bg-[rgba(255,248,237,0.78)] text-[#5A3E2B]"
              />
              is_active
            </label>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#8B735C]">
                title
              </label>
              <input
                value={row.title}
                onChange={(e) => patch(row.id, { title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B735C]">
                weekday
              </label>
              <input
                value={row.weekday}
                onChange={(e) => patch(row.id, { weekday: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                placeholder="每週三"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  start_time
                </label>
                <input
                  value={row.start_time}
                  onChange={(e) => patch(row.id, { start_time: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="20:00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  end_time
                </label>
                <input
                  value={row.end_time}
                  onChange={(e) => patch(row.id, { end_time: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="22:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  level_min
                </label>
                <input
                  value={renderMaybeEmpty(row.level_min)}
                  onChange={(e) =>
                    patch(row.id, { level_min: toNumOrEmpty(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  level_max
                </label>
                <input
                  value={renderMaybeEmpty(row.level_max)}
                  onChange={(e) =>
                    patch(row.id, { level_max: toNumOrEmpty(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="6"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B735C]">
                shuttlecock
              </label>
              <input
                value={row.shuttlecock}
                onChange={(e) => patch(row.id, { shuttlecock: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                placeholder="RSL No.4"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  price
                </label>
                <input
                  value={row.price}
                  onChange={(e) => patch(row.id, { price: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8B735C]">
                  capacity
                </label>
                <input
                  value={renderMaybeEmpty(row.capacity)}
                  onChange={(e) =>
                    patch(row.id, { capacity: toNumOrEmpty(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.78)] px-4 py-2.5 text-sm text-[#3A2A1E] outline-none placeholder:text-[#8B735C] focus:border-[rgba(185,133,82,0.35)] focus:ring-1 focus:ring-[rgba(185,133,82,0.18)]"
                  placeholder="16"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

