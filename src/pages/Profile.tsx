import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X, Check, Plus } from "lucide-react";
import { useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const circularRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    role: "Web Developer & Designer",
    skills: ["React", "Node.js", "TypeScript", "Python"],
  });

  return (
    <div className="min-h-screen bg-background dark:bg-[#1C1B23]">
      <div className="container mx-auto p-6 space-y-8">
        {/* Profile Information */}
        <Card className="dark:bg-[#1E1E2C] dark:border-[#2A2A3C] transform transition-all duration-300 hover:shadow-lg hover:shadow-[#6C5DD3]/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-playfair dark:text-white">Profile</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="dark:text-white dark:hover:bg-[#2A2A3C] transform active:scale-90 transition-all duration-200 hover:rotate-12"
            >
              {isEditing ? (
                <X className="h-5 w-5" />
              ) : (
                <Pencil className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative w-32 h-32 group transform transition-transform duration-300 hover:scale-105">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full border-4 border-primary/30 dark:border-[#6C5DD3]/30 transition-all duration-300"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-white transform transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4 text-center md:text-left flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="text-xl font-semibold dark:bg-[#1C1B23] dark:border-[#2A2A3C] dark:text-white 
                        focus:ring-2 focus:ring-[#6C5DD3] transition-all duration-300 hover:border-[#6C5DD3]/50"
                    />
                    <Input
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className="dark:bg-[#1C1B23] dark:border-[#2A2A3C] dark:text-gray-400
                        focus:ring-2 focus:ring-[#6C5DD3] transition-all duration-300 hover:border-[#6C5DD3]/50"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="dark:bg-[#1C1B23] dark:border-[#2A2A3C] dark:text-white dark:hover:bg-[#2A2A3C]
                          transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="dark:bg-[#6C5DD3] dark:hover:bg-[#6C5DD3]/80
                          transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0
                          hover:shadow-lg hover:shadow-[#6C5DD3]/50"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-playfair font-semibold bg-gradient-to-r from-primary to-primary/60 
                      dark:from-[#6C5DD3] dark:to-[#8A7EF2] bg-clip-text text-transparent
                      transform transition-all duration-300 hover:scale-105">
                      {profileData.name}
                    </h2>
                    <p className="text-muted-foreground dark:text-gray-400">{profileData.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge className="dark:bg-[#6C5DD3] dark:hover:bg-[#6C5DD3]/80 
                        transform transition-all duration-200 hover:scale-110 active:scale-95">
                        Available for Mentoring
                      </Badge>
                      <Badge variant="secondary" 
                        className="dark:bg-[#2A2A3C] dark:text-white
                        transform transition-all duration-200 hover:scale-110 active:scale-95">
                        5 Years Experience
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="dark:bg-[#1E1E2C] dark:border-[#2A2A3C] transform transition-all duration-300 hover:shadow-lg hover:shadow-[#6C5DD3]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-playfair dark:text-white">Interested Skills</CardTitle>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-white dark:hover:bg-[#2A2A3C] group
                    transform transition-all duration-200 hover:scale-110 active:scale-95"
                  onClick={() => {
                    setProfileData({
                      ...profileData,
                      skills: [...profileData.skills, "New Skill"]
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 transform transition-transform duration-200 group-hover:rotate-180" />
                  Add Skill
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border 
                    dark:border-[#2A2A3C] dark:bg-[#1C1B23] dark:hover:bg-[#2A2A3C] 
                    transform transition-all duration-300 hover:-translate-x-1 hover:shadow-md"
                >
                  {isEditing ? (
                    <Input
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...profileData.skills];
                        newSkills[index] = e.target.value;
                        setProfileData({ ...profileData, skills: newSkills });
                      }}
                      className="dark:bg-[#1C1B23] dark:border-[#2A2A3C] dark:text-white
                        focus:ring-2 focus:ring-[#6C5DD3] transition-all duration-300"
                    />
                  ) : (
                    <span className="font-medium dark:text-gray-200">{skill}</span>
                  )}
                  <Badge className="dark:bg-[#6C5DD3]/20 dark:text-[#6C5DD3] dark:hover:bg-[#6C5DD3]/30
                    transform transition-all duration-200 hover:scale-110 active:scale-95">
                    Interested
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Badges Section with circular rotation */}
          <Card className="dark:bg-[#1E1E2C] dark:border-[#2A2A3C] transform transition-all duration-300 hover:shadow-lg hover:shadow-[#6C5DD3]/10">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair dark:text-white">Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🌟", name: "Top Contributor", level: "Level 3", color: "from-yellow-500 to-amber-600" },
                  { icon: "🎯", name: "Goal Achiever", level: "Master", color: "from-purple-500 to-indigo-600" },
                  { icon: "🤝", name: "Team Player", level: "Expert", color: "from-blue-500 to-cyan-600" },
                  { icon: "💡", name: "Innovator", level: "Elite", color: "from-green-500 to-emerald-600" }
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className="group relative overflow-hidden rounded-xl border dark:border-[#2A2A3C] 
                      bg-gradient-to-br dark:from-[#1C1B23] dark:to-[#2A2A3C] 
                      transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                      hover:shadow-[#6C5DD3]/20"
                  >
                    {/* Circular rotating background gradient */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 
                        group-hover:opacity-10 transition-opacity duration-500`}
                      style={{
                        animation: `${circularRotate} 8s linear infinite`
                      }}
                    />
                    
                    {/* Circular rotating outer ring */}
                    <div 
                      className="absolute inset-0 border-2 border-transparent dark:border-[#6C5DD3]/10 rounded-xl
                        group-hover:border-[#6C5DD3]/20 transition-colors duration-500"
                      style={{
                        animation: `${circularRotate} 12s linear infinite`
                      }}
                    />
                    
                    {/* Badge content */}
                    <div className="relative p-4 flex flex-col items-center gap-2">
                      {/* Badge icon with circular rotation */}
                      <div className="relative">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/20 to-[#8A7EF2]/20 
                            rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            animation: `${circularRotate} 6s linear infinite`
                          }}
                        />
                        <div className="text-4xl transform group-hover:scale-110 transition-all duration-300 relative z-10">
                          {badge.icon}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-base dark:text-white mt-2 text-center
                        bg-gradient-to-r from-[#6C5DD3] to-[#8A7EF2] bg-clip-text text-transparent
                        transform group-hover:scale-105 transition-all duration-300">
                        {badge.name}
                      </h3>
                      
                      <div className="text-sm dark:text-gray-400 opacity-0 
                        group-hover:opacity-100 transition-all duration-300">
                        {badge.level}
                      </div>

                      {/* Progress indicator with circular rotating gradient */}
                      <div className="w-full h-1 bg-[#2A2A3C]/30 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#6C5DD3] via-[#8A7EF2] to-[#6C5DD3]
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700
                            origin-left bg-[length:200%_100%]"
                          style={{
                            animation: `${circularRotate} 4s linear infinite`
                          }}
                        />
                      </div>
                    </div>

                    {/* Circular rotating glow effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/10 to-[#6C5DD3]/0
                        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                      style={{
                        animation: `${circularRotate} 10s linear infinite`
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 