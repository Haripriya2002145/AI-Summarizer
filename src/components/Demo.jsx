import React from 'react';
import LinkHistory from './LinkHistory';
import { useState, useEffect } from 'react';
import { DeleteIcon, copy, linkIcon, loader, tick } from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {

    const [article, setArticle]=useState({
        url: "",
        summary: ""
    })

    // RTK lazy query
    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

    const [allArticles, setAllArticles]=useState([])
    const [isFocus, setIsFocus]=useState("");
    

    useEffect(()=>{
        const localStorageArticles=JSON.parse(localStorage.getItem("articles"))
        //Articles from local storage that is saved after page reload.
        if(localStorageArticles){
            setAllArticles(localStorageArticles);
        }
    }, [])

    function handleOnChange(event){
        const {name, value}=event.target;
        //console.log(event.target);
        setArticle(prevValue=>{
            return({
                ...prevValue,
                url: value
            })
        });
        //console.log(article.url);
    }

    function handleOnFocus(){
        if(isFocus===false){
            setIsFocus(true);
        }
    }

    async function makeItNormalButton(){   
        await setTimeout(setIsFocus(false), 3000);//3000ms=3secs
    }

    async function handleSubmitButtonClick(e){
        e.preventDefault();
        const {data}=await(getSummary({articleUrl: article.url}));

        if(data?.summary){
            const newArticle={
                ...article,
                summary: data.summary
            }
            
            const updatedAllArticles=[...allArticles, newArticle];
            setAllArticles(updatedAllArticles);
            setArticle(newArticle);
            //console.log(newArticle);
            //console.log(allArticles);

            //Have to stringify as localStorage can only contain strings.
            localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
        }
        makeItNormalButton();
    }

    // const handleCopyClick=(copyURL)=>{
    //     navigator.clipboard.writeText(copyURL);
    //     setCopied(copyURL);
    //     setTimeout(()=>{
    //         setCopied("")
    //     }, 3000);
    // }

    const onCurrentArticle=(currentArticle)=>{
        setArticle(currentArticle);
    }

    const onDeleteArticleUrl=(id)=>{
        setAllArticles(prevArticles=>{
            return(
                prevArticles.filter(function(anArticle, index){
                    return(index!==id)
                })
            )
        })
    }

    return (
        
        <section className='demo-section'>
            {/* Creating the input field for getting the link */}
            <div className='demo-form-wrapper'>
                <form 
                    className="form-container" 
                    onSubmit={()=>{}}
                >
                    <img 
                        src={linkIcon} 
                        alt="link_icon" 
                        className="link_icon" 
                    />
                    <input
                        type='url'
                        name="enteredURL"
                        value={article.url}
                        className='url_input peer'
                        placeholder='Enter a URL'
                        onChange={handleOnChange}
                        onFocus={handleOnFocus}
                        required
                    />
                    <button 
                        type="submit"
                        className={`submit_btn ${isFocus && 'peerFocus'}`}
                        onClick={handleSubmitButtonClick}
                    >
                        <img src={tick} alt="Submit the URL" />
                    </button>
                </form>
            </div>

            {/* Browse URL History */}
            <div className='history'>
                {allArticles.map((anArticle, index)=>(
                    <LinkHistory 
                        key={index} 
                        id={index}
                        urlLink={anArticle.url} 
                        currentArticle={onCurrentArticle}
                        mySummary={anArticle.summary}
                        deleteArticleUrl={onDeleteArticleUrl}
                    />
                ))}
            </div>

            {/* Get details and Summary */}
            <div className='details-wrapper'>
                {isFetching? 
                    (<img className='loading_icon' src={loader} alt="loading" />)
                :error?(
                <div>
                    <p className='error-message'>
                        Well, That wasn't supposed to happen, please try again later or contact the developer.<br/>
                        <span className='detailed-error'>
                            {error?.data?.error}
                        </span>
                    </p>
                </div>
                ): article.summary && 
                (
                <div className='summary_wrapper'>
                    <h2 className='article-summary-text'>Article <span className='blue_gradient'>Summary</span></h2>
                    <div className='summary_box summary_text'>
                        {article.summary}
                    </div>
                </div>)
                }
            </div>
        </section>
    )
}

export default Demo;
