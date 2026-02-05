import TopazToolsCliente from "@/app/topaz-tools/topaz-tools-cliente";

export default async function TopazToolsPage() {
    return <>
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <TopazToolsCliente/>
        </main>
    </>
}