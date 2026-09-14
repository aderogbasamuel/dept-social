import { Gift } from "lucide-react";

const events = [
  { title: "Dept Tech Talk", date: "24 May, 2026", place: "Auditorium" },
  { title: "Faculty Games Day", date: "31 May – 2 Jun", place: "Main Field" },
  { title: "Workshop: React 101", date: "7 Jun, 2026", place: "Lab 3" },
];

const birthdays = ["Chidi Okafor", "Amara Nwosu", "Tomiwa Bello"];

const groups = [
  { name: "Photography Club", members: "1.2K" },
  { name: "Coding Buddies", members: "2.5K" },
  { name: "Music Society", members: "980" },
];

export default function RightSidebar() {
  return (
    <aside className="w-72 shrink-0 hidden xl:flex flex-col gap-5">
      <div className="bg-white rounded-2xl p-4 shadow-sm shadow-emerald-900/5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-gray-800">
            Upcoming Events
          </p>
          <span className="text-xs text-emerald-600">See all</span>
        </div>
        <div className="flex flex-col gap-3">
          {events.map((e) => (
            <div key={e.title} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {e.title}
                </p>
                <p className="text-xs text-gray-400">
                  {e.date} · {e.place}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm shadow-emerald-900/5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-gray-800">
            Birthdays Today
          </p>
          <span className="text-xs text-emerald-600">See all</span>
        </div>
        <div className="flex flex-col gap-3">
          {birthdays.map((name) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100" />
                <p className="text-sm text-gray-700">{name}</p>
              </div>
              <Gift size={16} className="text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm shadow-emerald-900/5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-gray-800">
            Popular Groups
          </p>
          <span className="text-xs text-emerald-600">See all</span>
        </div>
        <div className="flex flex-col gap-3">
          {groups.map((g) => (
            <div key={g.name} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {g.name}
                </p>
                <p className="text-xs text-gray-400">{g.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-900 rounded-2xl p-5 text-emerald-50">
        <p className="text-sm leading-relaxed italic">
          "Small steps every day lead to the biggest change."
        </p>
      </div>
    </aside>
  );
}
