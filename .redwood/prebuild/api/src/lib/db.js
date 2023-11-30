// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client';
import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger';
import { logger } from "./logger";

/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error'])
});
handlePrismaLogging({
  db,
  logger,
  logLevels: ['info', 'warn', 'error']
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJlbWl0TG9nTGV2ZWxzIiwiaGFuZGxlUHJpc21hTG9nZ2luZyIsImxvZ2dlciIsImRiIiwibG9nIiwibG9nTGV2ZWxzIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBpL3NyYy9saWIvZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gU2VlIGh0dHBzOi8vd3d3LnByaXNtYS5pby9kb2NzL3JlZmVyZW5jZS90b29scy1hbmQtaW50ZXJmYWNlcy9wcmlzbWEtY2xpZW50L2NvbnN0cnVjdG9yXG4vLyBmb3Igb3B0aW9ucy5cblxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmltcG9ydCB7IGVtaXRMb2dMZXZlbHMsIGhhbmRsZVByaXNtYUxvZ2dpbmcgfSBmcm9tICdAcmVkd29vZGpzL2FwaS9sb2dnZXInXG5cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJ1xuXG4vKlxuICogSW5zdGFuY2Ugb2YgdGhlIFByaXNtYSBDbGllbnRcbiAqL1xuZXhwb3J0IGNvbnN0IGRiID0gbmV3IFByaXNtYUNsaWVudCh7XG4gIGxvZzogZW1pdExvZ0xldmVscyhbJ2luZm8nLCAnd2FybicsICdlcnJvciddKSxcbn0pXG5cbmhhbmRsZVByaXNtYUxvZ2dpbmcoe1xuICBkYixcbiAgbG9nZ2VyLFxuICBsb2dMZXZlbHM6IFsnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG59KVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOztBQUVBLFNBQVNBLFlBQVksUUFBUSxnQkFBZ0I7QUFFN0MsU0FBU0MsYUFBYSxFQUFFQyxtQkFBbUIsUUFBUSx1QkFBdUI7QUFFMUUsU0FBU0MsTUFBTTs7QUFFZjtBQUNBO0FBQ0E7QUFDQSxPQUFPLE1BQU1DLEVBQUUsR0FBRyxJQUFJSixZQUFZLENBQUM7RUFDakNLLEdBQUcsRUFBRUosYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQyxDQUFDO0FBRUZDLG1CQUFtQixDQUFDO0VBQ2xCRSxFQUFFO0VBQ0ZELE1BQU07RUFDTkcsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPO0FBQ3JDLENBQUMsQ0FBQyJ9