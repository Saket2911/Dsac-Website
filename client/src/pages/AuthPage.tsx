import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Code2, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup } = useAuth();

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [college, setCollege] = useState("");
    const [leetcodeId, setLeetcodeId] = useState("");
    const [codeforcesId, setCodeforcesId] = useState("");
    const [codechefId, setCodechefId] = useState("");
    const [hackerrankId, setHackerrankId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            let result;
            if (mode === "login") {
                result = await login(email, password);
            } else {
                if (!name.trim()) {
                    setError("Name is required");
                    setIsLoading(false);
                    return;
                }
                result = await signup({
                    name,
                    email,
                    password,
                    college,
                    leetcodeId: leetcodeId.trim() || undefined,
                    codeforcesId: codeforcesId.trim() || undefined,
                    codechefId: codechefId.trim() || undefined,
                    hackerrankId: hackerrankId.trim() || undefined,
                });
            }

            if (!result.success) {
                setError(result.message);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
            {/* Background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }} />

            <div className="w-full max-w-md relative z-10">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">DSAC</h1>
                    <p className="text-muted-foreground mt-1">Data Structures & Algorithms Club</p>
                </div>

                <Card className="border-border/50 shadow-xl">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-serif">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </CardTitle>
                        <CardDescription>
                            {mode === "login"
                                ? "Sign in to track your progress and compete"
                                : "Join the club and start your coding journey"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === "signup" && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="college">College</Label>
                                        <Input
                                            id="college"
                                            placeholder="Vasavi College of Engineering"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {mode === "signup" && (
                                <div className="space-y-3 pt-2 border-t border-border/40">
                                    <p className="text-sm font-medium text-muted-foreground">Platform IDs <span className="text-xs">(optional — can add later)</span></p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="leetcodeId" className="text-xs">LeetCode</Label>
                                            <Input
                                                id="leetcodeId"
                                                placeholder="username"
                                                value={leetcodeId}
                                                onChange={(e) => setLeetcodeId(e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="codeforcesId" className="text-xs">Codeforces</Label>
                                            <Input
                                                id="codeforcesId"
                                                placeholder="handle"
                                                value={codeforcesId}
                                                onChange={(e) => setCodeforcesId(e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="codechefId" className="text-xs">CodeChef</Label>
                                            <Input
                                                id="codechefId"
                                                placeholder="username"
                                                value={codechefId}
                                                onChange={(e) => setCodechefId(e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="hackerrankId" className="text-xs">HackerRank</Label>
                                            <Input
                                                id="hackerrankId"
                                                placeholder="username"
                                                value={hackerrankId}
                                                onChange={(e) => setHackerrankId(e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-secondary text-white rounded-lg h-11 font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {mode === "login" ? "Sign In" : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">
                                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                            </span>{" "}
                            <button
                                onClick={() => {
                                    setMode(mode === "login" ? "signup" : "login");
                                    setError("");
                                }}
                                className="text-primary hover:underline font-medium"
                            >
                                {mode === "login" ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Vasavi College of Engineering &bull; DSAC Platform
                </p>
            </div>
        </div>
    );
}
