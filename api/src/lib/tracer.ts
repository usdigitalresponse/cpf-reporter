import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { PrismaInstrumentation } from '@prisma/instrumentation'
import tracer from 'dd-trace'

const { TracerProvider } = tracer.init()

const provider = new TracerProvider()

registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [new PrismaInstrumentation()],
})

provider.register()

export { tracer }
