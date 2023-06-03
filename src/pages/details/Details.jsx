import React from 'react'
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom'
import DetailsBanner from './detailsBanner/DetailsBanner'
import Cast from './cast/Cast'
import VideosSection from './videosSection/videosSection'
import Similar from './carousels/Similar'
import Recommendation from './carousels/Rcommendation'

import './style.scss'

const Details = () => {

  const {mediaType, id} = useParams();

  const{data, loading} = useFetch(`/${mediaType}/${id}/videos `);
  const{data: credits, loading: creditsLoading} = useFetch(`/${mediaType}/${id}/credits`);
 
  return (
    //here we add cast and video trailer of flilm or tv show (there are more than one video in api and beacuse of that we get array index[7] beacuse on 7th index there are trailer)
    <div>
      <DetailsBanner video={data?.results?.[0]} crew = {credits?.crew}/>
      <Cast data ={credits?.cast} loading = {creditsLoading}/>
      <VideosSection data={data}  loading={loading}/>
      <Similar mediaType={mediaType} id={id}/>
      <Recommendation mediaType={mediaType} id={id}/>
    </div>
  )
}

export default Details