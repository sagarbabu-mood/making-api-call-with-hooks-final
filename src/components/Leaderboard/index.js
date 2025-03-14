import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import {LeaderboardContainer, LoadingViewContainer} from './styledComponents'
import LeaderboardTable from '../LeaderboardTable'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getLeaderboardData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })

      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      const response = await fetch(url, options)
      const responseData = await response.json()
      console.log(responseData, responseData.error_msg)
      if (response.ok) {
        setApiResponse({
          status: apiStatusConstants.success,
          data: responseData.leaderboard_data,
          errorMsg: null,
        })
      } else {
        setApiResponse({
          status: apiStatusConstants.failure,
          data: null,
          errorMsg: responseData.error_msg,
        })
      }
    }

    getLeaderboardData()
  }, [])

  const renderFailureView = () => {
    const {errorMsg} = apiResponse

    return (
      <div>
        <p>{errorMsg}</p>
      </div>
    )
  }

  const renderSuccessView = () => {
    const {data} = apiResponse
    return <LeaderboardTable leaderboardData={data} />
  }

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderLeaderboard = () => {
    const {status} = apiResponse

    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
