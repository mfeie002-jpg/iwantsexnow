import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Eye, Heart, MessageCircle, Users, Calendar } from "lucide-react";

interface ProfileStatsProps {
  userId?: string;
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  // Mock data for profile views over time
  const profileViewsData = [
    { date: "Mon", views: 24, likes: 5 },
    { date: "Tue", views: 32, likes: 8 },
    { date: "Wed", views: 45, likes: 12 },
    { date: "Thu", views: 38, likes: 9 },
    { date: "Fri", views: 56, likes: 15 },
    { date: "Sat", views: 72, likes: 21 },
    { date: "Sun", views: 65, likes: 18 }
  ];

  // Activity by hour
  const activityByHour = [
    { hour: "6am", messages: 2, views: 5 },
    { hour: "9am", messages: 5, views: 12 },
    { hour: "12pm", messages: 8, views: 20 },
    { hour: "3pm", messages: 12, views: 25 },
    { hour: "6pm", messages: 18, views: 35 },
    { hour: "9pm", messages: 25, views: 45 },
    { hour: "12am", messages: 15, views: 30 }
  ];

  // Demographics
  const viewerDemographics = [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 45 },
    { name: "35-44", value: 25 },
    { name: "45+", value: 15 }
  ];

  const COLORS = ["#EC4899", "#9333EA", "#F59E0B", "#10B981"];

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600">332</div>
              <div className="text-xs text-gray-600">Profile Views</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <Heart className="text-pink-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-pink-600">88</div>
              <div className="text-xs text-gray-600">Total Likes</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-purple-600">85</div>
              <div className="text-xs text-gray-600">Messages</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-green-600">23</div>
              <div className="text-xs text-gray-600">Matches</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Views & Likes Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Weekly Activity</h3>
            <p className="text-sm text-gray-600">Profile views and likes over the past week</p>
          </div>
          <TrendingUp className="text-green-600" size={24} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={profileViewsData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="views" stroke="#EC4899" fillOpacity={1} fill="url(#colorViews)" name="Profile Views" />
            <Area type="monotone" dataKey="likes" stroke="#9333EA" fillOpacity={1} fill="url(#colorLikes)" name="Likes" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Peak Activity Hours */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-pink-600" size={24} />
            <div>
              <h3 className="text-xl font-bold">Peak Activity Times</h3>
              <p className="text-sm text-gray-600">Best times to get noticed</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#EC4899" name="Profile Views" />
              <Bar dataKey="messages" fill="#9333EA" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Viewer Demographics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-purple-600" size={24} />
            <div>
              <h3 className="text-xl font-bold">Who Viewed Your Profile</h3>
              <p className="text-sm text-gray-600">Age distribution of viewers</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={viewerDemographics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {viewerDemographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}