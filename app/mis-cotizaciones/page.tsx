import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Cotizacion } from '@/types';
import Link from 'next/link';
import { UploadComprobante } from '@/components/ui/UploadComprobante';

export const revalidate = 0;

export default async function MisCotizacionesPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: cotizaciones } = await supabase
        .from('cotizaciones')
        .select('*, tatuador:tatuador_id(nombre_completo, foto_url, instagram)')
        .eq('cliente_id', user.id)
        .order('created_at', { ascending: false });

    const estadoColor: Record<string, string> = {
        pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        cotizada: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        aceptada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        rechazada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    };

    const estadoLabel: Record<string, string> = {
        pendiente: '⏳ Pendiente',
        cotizada: '💰 Cotizada',
        aceptada: '✅ Aceptada',
        rechazada: '❌ Rechazada',
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold dark:text-white">Mis Cotizaciones</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Aquí puedes ver el estado de tus solicitudes de tatuaje.
                </p>
            </div>

            {(!cotizaciones || cotizaciones.length === 0) ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Aún no has enviado ninguna cotización.
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-block text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-white"
                    >
                        Explorar tatuadores →
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {cotizaciones.map((cot: any) => (
                        <div key={cot.id} className="rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-semibold dark:text-white">
                                            {cot.tatuador?.nombre_completo || 'Tatuador'}
                                        </h3>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColor[cot.estado] || ''}`}>
                                            {estadoLabel[cot.estado] || cot.estado}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
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

                                    <div className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        <p className="italic">&quot;{cot.idea_descripcion}&quot;</p>
                                    </div>

                                    {/* Si el tatuador respondió */}
                                    {cot.estado === 'cotizada' && cot.precio_ofrecido && (
                                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                                            <h4 className="font-semibold text-blue-900 dark:text-blue-200">💬 Respuesta del Tatuador</h4>
                                            {cot.mensaje_tatuador && (
                                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">{cot.mensaje_tatuador}</p>
                                            )}
                                            <div className="mt-2 flex gap-6 text-sm">
                                                <p className="text-blue-900 dark:text-blue-200">
                                                    <span className="font-medium">Precio total:</span> ${cot.precio_ofrecido?.toLocaleString('es-CL')}
                                                </p>
                                                <p className="text-blue-900 dark:text-blue-200">
                                                    <span className="font-medium">Abono:</span> ${cot.monto_abono?.toLocaleString('es-CL')}
                                                </p>
                                            </div>

                                            {/* Botón para subir comprobante */}
                                            <div className="mt-4">
                                                <UploadComprobante cotizacionId={cot.id} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
