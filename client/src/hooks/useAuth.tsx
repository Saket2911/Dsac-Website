import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    college: string;
    platformIds: {
        leetcodeId?: string;
        codeforcesId?: string;
        codechefId?: string;
        hackerrankId?: string;
    };
    xp: number;
    level: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (user: User) => void;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    college?: string;
    leetcodeId?: string;
    codeforcesId?: string;
    codechefId?: string;
    hackerrankId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("dsac_token");
        const savedUser = localStorage.getItem("dsac_user");
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("dsac_token");
                localStorage.removeItem("dsac_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || "Login failed" };

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("dsac_token", data.token);
            localStorage.setItem("dsac_user", JSON.stringify(data.user));
            return { success: true, message: "Login successful" };
        } catch (err) {
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const signup = async (signupData: SignupData) => {
        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || "Signup failed" };

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("dsac_token", data.token);
            localStorage.setItem("dsac_user", JSON.stringify(data.user));
            return { success: true, message: "Account created successfully" };
        } catch (err) {
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("dsac_token");
        localStorage.removeItem("dsac_user");
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("dsac_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                signup,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
