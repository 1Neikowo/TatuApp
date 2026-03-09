import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { RespondCotizacion } from '@/components/ui/RespondCotizacion';
import { VerificarPago } from '@/components/ui/VerificarPago';

export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is a tatuador
    const { data: perfil } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!perfil || perfil.rol !== 'tatuador') {
        redirect('/');
    }

    // Get cotizaciones for this tatuador
    const { data: cotizaciones } = await supabase
        .from('cotizaciones')
        .select('*, cliente:cliente_id(nombre_completo, correo, telefono)')
        .eq('tatuador_id', user.id)
        .order('created_at', { ascending: false });

    // Get citas pending verification
    const { data: citasPendientes } = await supabase
        .from('citas')
        .select('*, cotizacion:cotizacion_id(*, cliente:cliente_id(nombre_completo, correo))')
        .eq('estado_pago', 'por_verificar');

    const pendientes = cotizaciones?.filter((c: any) => c.estado === 'pendiente') || [];
    const cotizadas = cotizaciones?.filter((c: any) => c.estado === 'cotizada') || [];
    const aceptadas = cotizaciones?.filter((c: any) => c.estado === 'aceptada') || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Panel del Tatuador</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Bienvenido, {perfil.nombre_completo}
                    </p>
                </div>
                <a href="/dashboard/perfil">
                    <Button variant="outline">✏️ Editar Perfil</Button>
                </a>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-4 dark:border-gray-800">
                    <p className="text-2xl font-bold dark:text-white">{pendientes.length}</p>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
                <div className="rounded-lg border bg-card p-4 dark:border-gray-800">
                    <p className="text-2xl font-bold dark:text-white">{cotizadas.length}</p>
                    <p className="text-sm text-muted-foreground">Cotizadas</p>
                </div>
                <div className="rounded-lg border bg-card p-4 dark:border-gray-800">
                    <p className="text-2xl font-bold dark:text-white">{aceptadas.length}</p>
                    <p className="text-sm text-muted-foreground">Aceptadas</p>
                </div>
                <div className="rounded-lg border bg-card p-4 dark:border-gray-800">
                    <p className="text-2xl font-bold dark:text-white">{citasPendientes?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Abonos por Verificar</p>
                </div>
            </div>

            {/* Abonos por verificar */}
            {citasPendientes && citasPendientes.length > 0 && (
                <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
                    <div className="border-b border-yellow-200 px-6 py-4 dark:border-yellow-800">
                        <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200">
                            ⚠️ Abonos por Verificar
                        </h2>
                    </div>
                    <div className="divide-y divide-yellow-200 dark:divide-yellow-800">
                        {citasPendientes.map((cita: any) => (
                            <div key={cita.id} className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="font-semibold dark:text-white">
                                            {cita.cotizacion?.cliente?.nombre_completo || 'Cliente'}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {cita.cotizacion?.cliente?.correo}
                                        </p>
                                        {cita.comprobante_url && (
                                            <a
                                                href={cita.comprobante_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                📎 Ver Comprobante
                                            </a>
                                        )}
                                    </div>
                                    <VerificarPago citaId={cita.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cotizaciones Pendientes */}
            <div className="rounded-lg border bg-card shadow-sm dark:border-gray-800">
                <div className="border-b border-border bg-muted/50 px-6 py-4">
                    <h2 className="text-lg font-medium text-card-foreground">
                        Cotizaciones Pendientes ({pendientes.length})
                    </h2>
                </div>
                <div className="divide-y divide-border">
                    {pendientes.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            No tienes cotizaciones pendientes.
                        </div>
                    ) : (
                        pendientes.map((cot: any) => (
                            <div key={cot.id} className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold dark:text-white">
                                                {cot.cliente?.nombre_completo || 'Cliente'}
                                            </h3>
                                            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                                ⏳ Pendiente
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {cot.cliente?.correo} {cot.cliente?.telefono && `· ${cot.cliente.telefono}`}
                                        </p>
                                        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Zona:</span> {cot.zona_cuerpo}
                                            </div>
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Tamaño:</span> {cot.tamano_cm}
                                            </div>
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Estilo:</span> {cot.es_color ? 'Color' : 'Blackwork/Sombra'}
                                            </div>
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Fecha:</span>{' '}
                                                {new Date(cot.created_at).toLocaleDateString('es-CL')}
                                            </div>
                                        </div>
                                        <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                            <p className="italic">&quot;{cot.idea_descripcion}&quot;</p>
                                        </div>
                                    </div>

                                    {/* Respond form */}
                                    <div className="md:w-72">
                                        <RespondCotizacion cotizacionId={cot.id} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
