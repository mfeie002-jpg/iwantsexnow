import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

export function AvailabilityCalendar({ escortName }: { escortName: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Mock availability data
  const getAvailabilityForDate = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return [
      { time: "09:00 - 12:00", available: !isWeekend, price: 500 },
      { time: "12:00 - 15:00", available: true, price: 500 },
      { time: "15:00 - 18:00", available: true, price: 500 },
      { time: "18:00 - 21:00", available: !isWeekend, price: 600 },
      { time: "21:00 - 00:00", available: true, price: 700 }
    ];
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon size={24} className="text-pink-600" />
          Availability Calendar
        </h3>
        <Badge className="bg-green-500 text-white">
          <CheckCircle size={12} className="mr-1" />
          Real-time Updates
        </Badge>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={previousMonth}
          className="hover:bg-pink-50"
        >
          <ChevronLeft size={18} />
        </Button>
        <h4 className="text-lg font-bold text-gray-900">{monthName}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="hover:bg-pink-50"
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isPastDate = isPast(date);
            const isTodayDate = isToday(date);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const hasAvailability = getAvailabilityForDate(date).some(slot => slot.available);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isPastDate && setSelectedDate(date)}
                disabled={isPastDate}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  isPastDate
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : isSelected
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-600 scale-105 shadow-lg"
                    : isTodayDate
                    ? "bg-pink-50 text-pink-600 border-pink-300 font-bold"
                    : hasAvailability
                    ? "bg-white border-gray-300 hover:border-pink-600 hover:bg-pink-50 text-gray-900"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-semibold">{date.getDate()}</span>
                  {!isPastDate && hasAvailability && (
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="border-t-2 border-gray-200 pt-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-pink-600" />
            Available Time Slots - {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h4>

          <div className="space-y-2">
            {getAvailabilityForDate(selectedDate).map((slot, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  slot.available
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock size={16} className={slot.available ? "text-green-600" : "text-gray-400"} />
                  <span className={`font-semibold ${slot.available ? "text-gray-900" : "text-gray-500"}`}>
                    {slot.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {slot.available ? (
                    <>
                      <span className="text-sm font-bold text-gray-900">CHF {slot.price}</span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      >
                        Book Now
                      </Button>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            💡 Book at least 2 hours in advance for guaranteed availability
          </p>
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-8 text-gray-500">
          <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Select a date to view available time slots</p>
        </div>
      )}
    </Card>
  );
}