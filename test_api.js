async function runTests() {
    const API_URL = 'http://localhost:3000/api';
    console.log('--- Iniciando Tests de la API de Panadería ---');

    try {
        // 1. Health check
        console.log('\n[1] Probando raíz (Health check)');
        const rootRes = await fetch('http://localhost:3000/');
        console.log(await rootRes.json());

        // 2. Crear Cliente exitoso
        console.log('\n[2] Creando un nuevo cliente...');
        const cliente1Res = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: "Juan Perez", telefono: "1122334455" })
        });
        const cliente1 = await cliente1Res.json();
        console.log("Cliente creado:", cliente1);

        // 3. Crear Cliente fallido (validación Zod)
        console.log('\n[3] Creando cliente con datos inválidos...');
        const clienteInvalidoRes = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: "J", telefono: "123" }) // inválido
        });
        console.log("Error de validación:", await clienteInvalidoRes.json());

        // 4. Crear Turno exitoso
        console.log('\n[4] Creando turno válido...');
        const turno1Res = await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: "2026-03-01", hora: "10:00", clienteId: cliente1.id })
        });
        console.log("Turno creado:", await turno1Res.json());

        // 5. Crear Turno fallido (Misma hora)
        console.log('\n[5] Creando turno en la misma hora exacta (Debe fallar)...');
        const turnoMismaHoraRes = await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: "2026-03-01", hora: "10:00", clienteId: cliente1.id })
        });
        console.log("Error de regla de negocio:", await turnoMismaHoraRes.json());

        // 6. Llegar al límite de turnos por día (Máx 3)
        console.log('\n[6] Creando turnos hasta llegar al límite diario...');
        await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: "2026-03-01", hora: "11:00", clienteId: cliente1.id })
        });
        await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: "2026-03-01", hora: "12:00", clienteId: cliente1.id })
        });

        // El 4to turno debe fallar por límite (3 turnos ya creados: 10:00, 11:00, 12:00)
        const turnoLimiteRes = await fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: "2026-03-01", hora: "13:00", clienteId: cliente1.id })
        });
        console.log("Resultado del 4to turno:", await turnoLimiteRes.json());

        // 7. Modificar estado del turno
        console.log('\n[7] Actualizando estado de un turno...');
        // Fetch all to get an ID
        const allTurnosRes = await fetch(`${API_URL}/turnos`);
        const allTurnos = await allTurnosRes.json();
        const targetId = allTurnos[0].id;

        const updateRes = await fetch(`${API_URL}/turnos/${targetId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: "completado" })
        });
        console.log("Turno actualizado:", await updateRes.json());

        console.log('\n--- Tests Finalizados ---');
    } catch (error) {
        console.error("Error durante los tests:", error);
    }
}

runTests();
