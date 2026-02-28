"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Target } from "lucide-react"

export function GoalTracker() {
    const goals = [
        { name: "Trả dứt điểm nợ thẻ tín dụng", current: 40, target: 40, completed: true, color: "bg-emerald-500" },
        { name: "Đạt 1 Tỷ VND tài sản đầu tiên", current: 650, target: 1000, completed: false, color: "bg-primary" },
        { name: "Quỹ hưu trí (10 Tỷ VND)", current: 1500, target: 10000, completed: false, color: "bg-sky-500" },
    ]

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Hành trình Ốc đảo Bình yên
                </CardTitle>
                <CardDescription>Theo dõi các cột mốc mục tiêu tài chính của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {goals.map((goal, index) => {
                    const percent = Math.min(100, Math.round((goal.current / goal.target) * 100))

                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className={`font-medium flex items-center gap-2 flex-1 ${goal.completed ? 'text-muted-foreground line-through' : ''}`}>
                                    {goal.completed && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                    {goal.name}
                                </span>
                                <span className="text-muted-foreground mr-4">
                                    {goal.current} / {goal.target}
                                </span>
                                <span className="font-bold w-10 text-right">{percent}%</span>
                            </div>
                            <Progress
                                value={percent}
                                className={`h-2 [&>div]:${goal.completed ? 'bg-emerald-500' : goal.color}`}
                            />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
