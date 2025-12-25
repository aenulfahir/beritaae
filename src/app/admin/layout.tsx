import { ThemeProvider } from "@/components/theme-provider";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-screen bg-muted/30">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="pl-56 transition-all duration-200">
                    <AdminHeader />
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </ThemeProvider>
    );
}

