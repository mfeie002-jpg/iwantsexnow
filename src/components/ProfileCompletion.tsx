import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Camera, FileText, Award, Zap } from "lucide-react";
import Link from "next/link";

interface ProfileCompletionProps {
  completionPercentage: number;
}

export function ProfileCompletion({ completionPercentage }: ProfileCompletionProps) {
  const steps = [
    {
      title: "Add Profile Photo",
      description: "Upload a clear photo of yourself",
      completed: completionPercentage >= 20,
      points: 20,
      icon: Camera,
      link: "/upload-photos"
    },
    {
      title: "Write Bio",
      description: "Tell others about yourself",
      completed: completionPercentage >= 40,
      points: 20,
      icon: FileText,
      link: "/profile"
    },
    {
      title: "Add More Photos",
      description: "Profiles with 3+ photos get 10x more views",
      completed: completionPercentage >= 60,
      points: 20,
      icon: Camera,
      link: "/upload-photos"
    },
    {
      title: "Verify Your Profile",
      description: "Get verified badge for trust",
      completed: completionPercentage >= 80,
      points: 20,
      icon: Award,
      link: "/verify"
    },
    {
      title: "Complete Preferences",
      description: "Set your matching preferences",
      completed: completionPercentage >= 100,
      points: 20,
      icon: Zap,
      link: "/preferences"
    }
  ];

  const nextStep = steps.find(step => !step.completed);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">Profile Completion</h3>
          <Badge className={completionPercentage === 100 ? "bg-green-500" : "bg-pink-600"}>
            {completionPercentage}%
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-3" />
        <p className="text-sm text-gray-600 mt-2">
          {completionPercentage === 100 
            ? "🎉 Your profile is complete! You'll get 3x more visibility."
            : `Complete your profile to get ${100 - completionPercentage}% more matches!`
          }
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                step.completed 
                  ? "bg-green-50 border-green-200" 
                  : nextStep === step
                  ? "bg-pink-50 border-pink-300 shadow-md"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.completed ? "bg-green-500" : "bg-gray-300"
              }`}>
                {step.completed ? (
                  <CheckCircle className="text-white" size={20} />
                ) : (
                  <Circle className="text-white" size={20} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={step.completed ? "text-green-600" : "text-gray-600"} />
                  <h4 className="font-bold text-sm">{step.title}</h4>
                  <Badge variant="outline" className="text-xs">+{step.points}%</Badge>
                </div>
                <p className="text-xs text-gray-600">{step.description}</p>
                {!step.completed && nextStep === step && (
                  <Button size="sm" className="mt-2 bg-pink-600 hover:bg-pink-700 h-7 text-xs" asChild>
                    <Link href={step.link}>Complete Now</Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completionPercentage === 100 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
          <div className="flex items-start gap-3">
            <Award className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-green-900 mb-1">Profile Master! 🏆</h4>
              <p className="text-sm text-green-800">
                Your complete profile gets 3x more views. Keep your photos updated for best results!
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}