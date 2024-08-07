"use client";
import React, { useState } from 'react'
import MemeList from '@/constants/meme-list.json';
import Image from 'next/image';
import PlaceholderImg from "@/assets/images/placeholder.webp"

function MemeGenerator() {
  const [memeImgGenerated, setMemeImgGenerated] = useState(PlaceholderImg.src);
  const [formData, setFormData] = useState({ memeBaseID: '', topText: '', bottomText: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!(formData.topText && formData.bottomText && formData.memeBaseID) || isLoading)
      return;

    setIsLoading(true);

    const memeBaseParam = `template_id=${formData.memeBaseID}`;
    const topTextParam = `&text0=${encodeURIComponent(formData.topText)}`
    const bottomTextParam = `&text1=${encodeURIComponent(formData.bottomText)}`
    const credentialsParam = `&username=${process.env.NEXT_PUBLIC_IMG_FLIP_USERNAME}&password=${process.env.NEXT_PUBLIC_IMG_FLIP_PASSWORD}`
    try {
      const res = await fetch(`https://api.imgflip.com/caption_image?${memeBaseParam}${topTextParam}${bottomTextParam}${credentialsParam}`, {
        method: 'POST',
      });
      const data = await res.json();
      console.log(data)
      if (res.ok && data.success) {
        setMemeImgGenerated(data.data.url)
      }
      else {
        setError(`Something went wrong: ${data.error_message}`)
      }
    }
    catch (error: any) {
      setError(`Something went wrong: ${error.message}`)
    }
    setIsLoading(false);
  }

  function handleDownload() {
    if (!memeImgGenerated)
      return;
    const link = document.createElement('a');
    link.href = memeImgGenerated;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <form className={`relative flex flex-col-reverse lg:flex-row justify-center items-start gap-8 px-4 py-1 ${isLoading ? "pointer-events-none" : ""}`} onSubmit={handleSubmit}>
      {isLoading && (<div className='absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-primary bg-opacity-80'>
        <div className='w-16 h-16 border-4 border-t-4 border-t-transparent border-secondary rounded-full animate-spin'></div>
      </div>
      )}
      <div className='flex flex-col flex-1'>
        <Image src={memeImgGenerated} priority alt="Meme generated" width={400} height={400} className='w-[400px] h-[400px] bg-secondary p-2 mx-auto object-contain border-2 border-secondary' />
        <button type='button' className='mt-2 bg-secondary text-white' 
        disabled={memeImgGenerated === PlaceholderImg.src} 
        onClick={handleDownload}>Download Image</button>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col mb-4'>
          <label>Meme base</label>
          <select required value={formData.memeBaseID} onChange={(e) => {
            setFormData({ ...formData, memeBaseID: e.target.value })
          }}>
            <option value="">Select a meme</option>
            {
              MemeList.memes.sort((a: any, b: any) => a.name.localeCompare(b.name)).map(meme => {
                return <option key={meme.ID} value={meme.ID}>
                  {meme.name}
                </option>
              })
            }
          </select>
          <div className='flex flex-col my-4'>
            <label>Top text</label>
            <input type='text' required value={formData.topText} onChange={(e) => {
              setFormData({ ...formData, topText: e.target.value })
            }}
            />
          </div>
          <div className='flex flex-col my-4'>
            <label>Bottom text</label>
            <input type='text' required value={formData.bottomText} onChange={(e) => {
              setFormData({ ...formData, bottomText: e.target.value })
            }}
            />
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          <button type='submit' disabled={isLoading} className='w-full my-4'>Generate meme</button>
        </div>
      </div>
    </form>
  )
}

export default MemeGenerator