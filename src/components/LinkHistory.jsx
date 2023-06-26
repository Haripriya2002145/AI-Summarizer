import React from 'react';
import {useState} from 'react';
import "../App.css";
import { DeleteIcon } from '../assets';
import {copy, tick} from '../assets';

function LinkHistory(props) {
    const [copied, setCopied]=useState("");

    function handleCopyClick(copyURL){      
        navigator.clipboard.writeText(copyURL);
        setCopied(copyURL);
        setTimeout(()=>{
            setCopied("")
        }, 3000);
    }

    function handleOnClick(){
        const articleToBeSet={
            url: props.urlLink,
            summary: props.mySummary
        }
        props.currentArticle(articleToBeSet);  
    }

    return (
        <div className='link_card' key={`link-${props.index}`}>
            <div 
                className='copy_btn'
                onClick={() => { handleCopyClick(props.urlLink) }}
            >
                <img
                    className='copy-img-btn'
                    src={copied === props.urlLink ? tick : copy}
                    alt="copy_icon"
                />
            </div>

            <p 
                className='url-item-history'
                onClick={handleOnClick}
            >
                {props.urlLink}
            </p>

            <img
                className='delete-img-btn'
                alt="delete_icon"
                src={DeleteIcon}
                onClick={() => {props.deleteArticleUrl(props.id)}}
            />
        </div>
    )
}

export default LinkHistory;