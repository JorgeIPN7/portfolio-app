/**
 * Limitador de peticiones en memoria.
 *
 * **Lo que no es**: una protección seria. En Vercel cada instancia tiene su
 * propia memoria, así que el mismo remitente repartido entre varias instancias
 * multiplica su cupo, y un despliegue lo borra todo. Para algo firme hace falta
 * un almacén compartido (Vercel KV, Upstash) o un captcha.
 *
 * **Lo que sí es**: el freno más barato posible contra el caso real y frecuente,
 * que es un robot machacando el mismo formulario desde la misma IP. Cuesta
 * treinta líneas y no añade ninguna dependencia. Se documenta así de claro para
 * que nadie lo confunda con lo primero.
 */
const registros = new Map<string, number[]>();

/** Evita que el mapa crezca sin fin cuando pasan muchas IPs distintas. */
const MAXIMO_CLAVES = 5_000;

export function dentroDelLimite(
  clave: string,
  maximo: number,
  ventanaMs: number,
): boolean {
  const ahora = Date.now();

  if (registros.size > MAXIMO_CLAVES) registros.clear();

  const recientes = (registros.get(clave) ?? []).filter(
    (momento) => ahora - momento < ventanaMs,
  );

  if (recientes.length >= maximo) {
    // Se reescribe igualmente para descartar los intentos ya caducados: si no,
    // la lista de un atacante insistente crecería sin tope.
    registros.set(clave, recientes);
    return false;
  }

  recientes.push(ahora);
  registros.set(clave, recientes);
  return true;
}
