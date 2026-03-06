import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Plus,
    Trash2,
    Edit2,
    Users,
    CalendarDays,
    Shield,
    ShieldCheck,
    AlertTriangle,
    Save,
    X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface DailyQuestionItem {
    _id: string;
    questionId: string;
    title: string;
    platform: string;
    difficulty: string;
    date: string;
    xpReward: number;
}

interface UserItem {
    _id: string;
    name: string;
    email: string;
    role: string;
    college: string;
    profilePicture: string;
    xp: number;
    level: number;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const [, navigate] = useLocation();

    // Daily Questions state
    const [questions, setQuestions] = useState<DailyQuestionItem[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<DailyQuestionItem | null>(null);

    // Question form
    const [qTitle, setQTitle] = useState("");
    const [qQuestionId, setQQuestionId] = useState("");
    const [qPlatform, setQPlatform] = useState("leetcode");
    const [qDifficulty, setQDifficulty] = useState("Easy");
    const [qDate, setQDate] = useState(new Date().toISOString().split("T")[0]);
    const [qXpReward, setQXpReward] = useState("10");
    const [savingQuestion, setSavingQuestion] = useState(false);

    // Users state
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [actionMessage, setActionMessage] = useState("");

    // Guard: only admins
    if (!user || user.role !== "admin") {
        return (
            <div className="py-20 text-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                <p className="text-muted-foreground">You must be an admin to access this page.</p>
                <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Fetch daily questions
    const fetchQuestions = async () => {
        setLoadingQuestions(true);
        try {
            const res = await fetch("/api/admin/daily-questions", { headers });
            const data = await res.json();
            setQuestions(data.questions || []);
        } catch { setQuestions([]); }
        finally { setLoadingQuestions(false); }
    };

    // Fetch users
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/admin/users", { headers });
            const data = await res.json();
            setUsers(data.users || []);
        } catch { setUsers([]); }
        finally { setLoadingUsers(false); }
    };

    useEffect(() => {
        fetchQuestions();
        fetchUsers();
    }, []);

    const showMsg = (msg: string) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(""), 3000);
    };

    // Save question (create or update)
    const handleSaveQuestion = async () => {
        setSavingQuestion(true);
        try {
            const body = {
                questionId: qQuestionId,
                title: qTitle,
                platform: qPlatform,
                difficulty: qDifficulty,
                date: qDate,
                xpReward: parseInt(qXpReward) || 10,
            };

            const url = editingQuestion
                ? `/api/admin/daily-question/${editingQuestion._id}`
                : "/api/admin/daily-question";

            const res = await fetch(url, {
                method: editingQuestion ? "PUT" : "POST",
                headers,
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (res.ok) {
                showMsg(editingQuestion ? "Question updated!" : "Question created!");
                resetForm();
                fetchQuestions();
            } else {
                showMsg(data.message || "Failed to save");
            }
        } catch {
            showMsg("Network error");
        }
        setSavingQuestion(false);
    };

    const resetForm = () => {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setQTitle("");
        setQQuestionId("");
        setQPlatform("leetcode");
        setQDifficulty("Easy");
        setQDate(new Date().toISOString().split("T")[0]);
        setQXpReward("10");
    };

    const startEditQuestion = (q: DailyQuestionItem) => {
        setEditingQuestion(q);
        setQTitle(q.title);
        setQQuestionId(q.questionId);
        setQPlatform(q.platform);
        setQDifficulty(q.difficulty);
        setQDate(q.date.split("T")[0]);
        setQXpReward(String(q.xpReward));
        setShowQuestionForm(true);
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm("Delete this daily question?")) return;
        try {
            const res = await fetch(`/api/admin/daily-question/${id}`, { method: "DELETE", headers });
            if (res.ok) { showMsg("Question deleted"); fetchQuestions(); }
        } catch { showMsg("Error deleting"); }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers });
            if (res.ok) { showMsg("User deleted"); fetchUsers(); }
            else {
                const data = await res.json();
                showMsg(data.message || "Error deleting user");
            }
        } catch { showMsg("Error deleting"); }
    };

    const updateRole = async (id: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (res.ok) { showMsg(`Role updated to ${newRole}`); fetchUsers(); }
            else { showMsg(data.message || "Error updating role"); }
        } catch { showMsg("Error updating role"); }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const diffColor = (d: string) => {
        switch (d) {
            case "Easy": return "text-green-500 bg-green-500/10 border-green-500/30";
            case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
            case "Hard": return "text-red-500 bg-red-500/10 border-red-500/30";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="py-10 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage daily questions and users</p>
                </div>
            </div>

            {actionMessage && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-sm text-primary font-medium animate-in fade-in duration-200">
                    {actionMessage}
                </div>
            )}

            <Tabs defaultValue="questions">
                <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-6 w-full justify-start">
                    <TabsTrigger value="questions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base gap-2">
                        <CalendarDays className="w-4 h-4" /> Daily Questions
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base gap-2">
                        <Users className="w-4 h-4" /> User Management
                    </TabsTrigger>
                </TabsList>

                {/* ===== DAILY QUESTIONS TAB ===== */}
                <TabsContent value="questions" className="pt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-foreground">Recent Daily Questions</h2>
                        <Button className="gap-2" onClick={() => { resetForm(); setShowQuestionForm(true); }}>
                            <Plus className="w-4 h-4" /> New Question
                        </Button>
                    </div>

                    {showQuestionForm && (
                        <Card className="border-primary/30 shadow-sm">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">
                                    {editingQuestion ? "Edit Question" : "Create Daily Question"}
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={qTitle} onChange={(e) => setQTitle(e.target.value)} placeholder="Two Sum" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Problem Slug / ID</Label>
                                        <Input value={qQuestionId} onChange={(e) => setQQuestionId(e.target.value)} placeholder="two-sum" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Platform</Label>
                                        <Select value={qPlatform} onValueChange={setQPlatform}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="leetcode">LeetCode</SelectItem>
                                                <SelectItem value="codeforces">Codeforces</SelectItem>
                                                <SelectItem value="codechef">CodeChef</SelectItem>
                                                <SelectItem value="hackerrank">HackerRank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Difficulty</Label>
                                        <Select value={qDifficulty} onValueChange={setQDifficulty}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={qDate} onChange={(e) => setQDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>XP Reward</Label>
                                        <Input type="number" value={qXpReward} onChange={(e) => setQXpReward(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                                    <Button className="gap-2" onClick={handleSaveQuestion} disabled={savingQuestion || !qTitle || !qQuestionId}>
                                        {savingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {editingQuestion ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {loadingQuestions ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No daily questions found. Create one!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {questions.map((q) => (
                                <Card key={q._id} className="border-border/50 shadow-sm hover:shadow transition-shadow">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-foreground">{q.title}</h3>
                                                <Badge variant="outline" className={diffColor(q.difficulty)}>{q.difficulty}</Badge>
                                                <Badge variant="secondary" className="text-[10px] capitalize">{q.platform}</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(q.date).toLocaleDateString()} • {q.xpReward} XP • ID: {q.questionId}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="ghost" size="icon" onClick={() => startEditQuestion(q)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteQuestion(q._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* ===== USER MANAGEMENT TAB ===== */}
                <TabsContent value="users" className="pt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-foreground">All Users ({users.length})</h2>
                        <Button variant="outline" onClick={fetchUsers} className="gap-2">
                            <Loader2 className={`w-4 h-4 ${loadingUsers ? "animate-spin" : ""}`} /> Refresh
                        </Button>
                    </div>

                    {loadingUsers ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">User</th>
                                            <th className="px-4 py-4 font-semibold">Email</th>
                                            <th className="px-4 py-4 font-semibold">Role</th>
                                            <th className="px-4 py-4 font-semibold">XP / Level</th>
                                            <th className="px-4 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            {u.profilePicture ? (
                                                                <AvatarImage src={u.profilePicture} alt={u.name} />
                                                            ) : null}
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(u.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-semibold text-foreground">{u.name}</span>
                                                        {u._id === user?._id && (
                                                            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">You</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                                <td className="px-4 py-3">
                                                    <Select
                                                        value={u.role}
                                                        onValueChange={(val) => updateRole(u._id, val)}
                                                        disabled={u._id === user?._id}
                                                    >
                                                        <SelectTrigger className="w-28 h-8">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="student">
                                                                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Student</span>
                                                            </SelectItem>
                                                            <SelectItem value="admin">
                                                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Admin</span>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-bold text-primary">{u.xp}</span>
                                                    <span className="text-muted-foreground"> / Lvl {u.level}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        disabled={u._id === user?._id}
                                                        onClick={() => deleteUser(u._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
