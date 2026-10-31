---
name: sdd-workflow
description: Flujo formal Spec-Driven Development (spec -> plan -> tasks) con Seams, ADR Gate, Puerta de Auditoria y verificacion proporcional.
---

# SDD Workflow Skill

Define el flujo formal de trabajo guiado por especificacion para `aceite-negro`.

## 1. Fases del Flujo SDD
1. **Especificacion (`specs/<feature>/spec.md`)**:
   - Requerimientos funcionales, contexto del problema y Criterios de Aceptacion (CA) numerados.
   - Identificacion preliminar de Seams.
2. **Plan Tecnico (`specs/<feature>/plan.md`)**:
   - **Architecture Alignment**: Alineacion con `docs/brain/architecture.md`.
   - **ADR Gate**: Consulta obligatoria a `docs/brain/decisions/index.md` antes de introducir patrones nuevos.
   - **UI / Frontend Gate**: Si la feature toca interfaz visual, alinear con `docs/brain/design.md` (creandolo antes con la skill `ui-design` si no existe) y comprobar en `docs/brain/architecture.md` si `E2E / Browser UI Tests` sigue en `N/A`; si es `N/A`, ofrecer e incluir como Tarea 1 de la feature el Auto-Bootstrap de `Agent Eyes` (Playwright + `ariaSnapshot` + Responsive Overflow Check) definido en `ui-design`.
   - **Seams bajo Prueba**: Acuerda costuras publicas de prueba apoyandose en la skill `tdd` (tests unitarios y de integracion entre modulos reales, sin acoplamiento a detalles internos).
3. **Lista de Tareas (`specs/<feature>/tasks.md`)**:
   - Tareas verticales siguiendo el ciclo estricto `RED -> GREEN -> REFACTOR`.
   - Exigencia de **Prueba Observada** (Observed Proof) en consola para cada tarea completada.
   - En tareas de UI, verificar en la **Prueba Observada** los 4 estados (Loading, Empty, Error, Populated), ausencia de colores hardcodeados fuera de tokens y la inspeccion semantica en vivo (`ariaSnapshot` + Responsive Check en `375px` y `1280px`).
4. **Implementacion TDD (Builder Subagent)**:
   - Delegacion en subagente con modelo rapido (`flash` / fast tier) ejecutando el bucle RED-GREEN-REFACTOR de forma aislada.
5. **Puerta de Auditoria Independiente (Auditor Subagent)**:
   - Evaluacion adversarial con contexto limpio (*clean context*) y modelo rapido (`flash` / fast tier) aplicando la Rubrica de 4 Puntos.
6. **Consolidacion de Cerebro y Modo Mentor (Main Agent)**:
   - Actualizacion de `docs/brain/index.md`, `modules/`, `handoff.md` y redaccion de guia didactica en `guides/`.

## 2. Puerta de Auditoria Independiente (Auditor Subagent)
Para prevenir la ceguera de taller (*Builder Blindness*) y la degradacion de contexto acumulado, una vez completadas las tareas en `tasks.md`, el Main Agent invoca un **Auditor Subagent** efimero con contexto limpio (*clean context*).

### Protocolo de Invocacion:
- **Entrada Minima**: `specs/<feature>/spec.md`, `specs/<feature>/plan.md`, `specs/<feature>/tasks.md` y el diff de cambios.
- **Rol de Solo Lectura**: El Auditor Subagent **no edita codigo**. Unicamente analiza, ejecuta comandos de verificacion y emite un veredicto estructurado.

### Rubrica de 4 Puntos de Auditoria:
1. **Trazabilidad de Criterios de Aceptacion (CA-X)**:
   - Mapear cada Criterio de Aceptacion de `spec.md` contra aserciones reales en los tests y componentes del codigo.
   - Ningun CA puede quedar sin verificacion comprobable.
2. **Ejecucion Determinista de Comandos**:
   - Ejecutar obligatoriamente `npm test` y `npm run lint`.
   - Si aplica harness o verificador propio, ejecutar `compass check` o la herramienta oficial del proyecto.
   - Comprobar que todos los comandos finalizan con exito (exit code 0).
3. **Inspeccion de Anti-Patrones de IA**:
   - Ausencia de mocks sobre el sistema bajo prueba (SUT). Solo se mockean fronteras externas declaradas.
   - Ausencia de tests tautologicos, asserts vacios o pruebas triviales que no validan comportamiento real.
   - Ausencia de bloques `except: pass` silenciosos, prints residuales de depuracion o branches incompletos.
4. **Veredicto Binario Estructurado**:
   - El reporte debe concluir obligatoriamente con uno de los dos veredictos:
     - `VERDICT: APPROVED`: Todos los CAs trazados, comandos en verde y cero anti-patrones.
     - `VERDICT: REJECTED`: Lista procesable y numerada de hallazgos especificos (archivo, linea y causa de rechazo).

### Bucle de Retroalimentacion (Feedback Loop):
- Si el veredicto es `VERDICT: REJECTED`, el Auditor retorna el informe al Main Agent sin modificar ningun archivo.
- El Main Agent crea tareas de correccion puntuales y despacha nuevamente al Builder Subagent.
- Tras la correccion, se re-invoca al Auditor Subagent hasta obtener `VERDICT: APPROVED`.

## 3. Regla de Verificacion Proporcional
- El subagente constructor con modelo rapido (`flash` / fast tier) ejecuta los tests unitarios e integracion (`npm test`) en cada ciclo vertical.
- Si la feature modifica la interfaz de usuario o flujos completos de aplicacion y el proyecto declara soporte para Playwright / E2E (`npx playwright test`) en `docs/brain/architecture.md`, anade una tarea final de verificacion E2E ejecutada tambien por el subagente ligero.
- Nunca inventar un test runner que no este declarado en `docs/brain/architecture.md`.
