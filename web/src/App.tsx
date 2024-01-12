import { datadogRum } from '@datadog/browser-rum'

if (process.env.DD_RUM_ENABLED === 'true') {
  datadogRum.init({
    applicationId: process.env.DD_RUM_APP_ID,
    clientToken: process.env.DD_RUM_CLIENT_TOKEN,
    sessionSampleRate: parseInt(process.env.DD_RUM_SESSION_SAMPLE_RATE),
    sessionReplaySampleRate: parseInt(
      process.env.DD_RUM_SESSION_REPLAY_SAMPLE_RATE
    ),
    trackUserInteractions:
      process.env.DD_RUM_TRACK_USER_INTERACTIONS !== 'false',
    trackResources: process.env.DD_RUM_TRACK_RESOURCES !== 'false',
    trackLongTasks: process.env.DD_RUM_TRACK_LONG_TASKS !== 'false',
    defaultPrivacyLevel: 'mask',
    site: process.env.DD_SITE || 'datadoghq.com',
    service: process.env.DD_SERVICE || 'cpf-reporter',
    env: process.env.DD_ENV,
    version: process.env.DD_VERSION,
    allowedTracingUrls: [global.RWJS_API_URL],
  })
}

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import { AuthProvider, useAuth } from './auth'

import './scss/custom.scss'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider useAuth={useAuth}>
          <Routes />
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
