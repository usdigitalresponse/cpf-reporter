import { useState, useEffect } from 'react'

import { PassageUser } from '@passageidentity/passage-elements/passage-user'

export function useCurrentUser() {
  const [result, setResult] = useState({
    isLoading: true,
    isAuthorized: false,
    username: '',
  })

  useEffect(() => {
    console.log('useEffect - useCurrentUser')
    let cancelRequest = false
    new PassageUser().userInfo().then((userInfo) => {
      if (cancelRequest) {
        console.log('cancel request')
        return
      }
      if (userInfo === undefined) {
        console.log('userInfo is undefined')
        setResult({
          isLoading: false,
          isAuthorized: false,
          username: '',
        })
        return
      }
      console.log('userInfo exists and user is authorized')
      setResult({
        isLoading: false,
        isAuthorized: true,
        username: userInfo.email,
      })
    })
    return () => {
      console.log('canceling request')
      cancelRequest = true
    }
  }, [])
  return result
}
