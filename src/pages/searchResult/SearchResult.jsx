import React, {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"

import  "./style.scss"

import {fetchDataFromApi} from "../../utils/api"
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard"
import Spinner from "../../components/spinner/Spinner"
import noResults from "../../assets/no-results.png"

const searchResult = () => {
  const [data, setData] = useState(null);
  //this pageNum for pagination
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  //this is our url query that we get from Api.jsx
  const {query} = useParams();

  //api call for fetching initial data

  const fetchInitialData = () =>
  {
    setLoading(true)
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      setData(res)
      setPageNum((prev) => prev + 1)
      setLoading(false)
    })

   }

   useEffect(() => {
    setPageNum(1)
    fetchInitialData();
   },[query])

   const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      //when we go 2nd page we loose 1st page data so we murge 1st page with 2nd so we do not murge data
      //and for that we check condition 1st
      if(data?.results) 
      {
        setData({
          ...data, results: [...data?.results, ...res.results]
        })
      }
      else
      {
        setData(res)
      }
      setPageNum((prev) => prev + 1)
    })
   }

  return (
    <div className="searchResultsPage">
      {/* add initial prop here */}
      {loading && <Spinner initial={true}/>}
      {!loading && (
        <ContentWrapper>
          {/* checking the conditon here if length is greater than zero the show data */}
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${data?.total_results > 1 ? "results" : "result"} of  '${query}'`}
              </div>

              <InfiniteScroll className="content" dataLength={data?.results.length || []}
              next={fetchNextPageData} hasMore={pageNum <= data?.total_pages}
              loader={<Spinner/>}>

                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return(
                    <MovieCard key={index} data ={item} fromSearch={true}></MovieCard>
                  )
                })}

              </InfiniteScroll>

            </>

          ):(
            <span className="resultNotFound">
              Sorry, Result Not found.
            </span>
          )}
        </ContentWrapper>
      )}
    </div>
  )
}

export default searchResult