import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { getSession, useSession, signOut } from "next-auth/react"
// import ListPhotos from './ListPhotos'
import { apiEndPoint, clientId } from './config/apiConfigue'
import axios from 'axios'
import Blog from './components/Blog'
import { useRouter } from 'next/router'

export default function Home({ data }) {
  const { data: session, status } = useSession()
  const router = useRouter();

  // sign ou function
  function handleSignOut() {
    signOut();
  }

  const [nextphotos, setNextPhotos] = useState([])
  // photos initial value
  const [photo, setPhoto] = useState([])


  const fetchData = () => {
    setNextPhotos([...data, ...nextphotos])
  }

  useEffect(() => {
    fetchData();
  }, [])

  // change and KeyDownSubmit search input for photos
  const handlChange = (e) => {
    setPhoto(e.target.value)
    console.log(photo)

  }
  const handlKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      axios.get(`${apiEndPoint}/search/photos/?page=1&client_id=${clientId}&query=${photo}`)
        .then(res => {
          const { results } = res.data
          console.log(results)
          setNextPhotos(results)
        })
        .catch(err => console.log(err))
    }
  }



  // format number likes and views
  const formatNumber = (number) => {

    if (number < 1000) {
      return number
    }
    else if (number > 1000 && number < 1000000) {
      return (number / 1000).toFixed(1) + "K"
    }
    else if (number > 1000000 && number < 1000000000) {
      return (number / 1000000).toFixed(1) + "M"
    }
    else if (number > 1000000000 && number < 1000000000000) {
      return (number / 1000000000).toFixed(1) + "B"
    }
  }


  const handleLike = (photo) => {
    const photos = [...nextphotos]
    const index = photos.indexOf(photo)
    console.log(index)
    photos[index]={...photos[index]}
    photos[index].liked_by_user = !photos[index].liked_by_user;
    photos[index].likes = photos[index].likes + 1 ;
    setNextPhotos(photos)
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        {status === 'authenticated' ?
          Blog({ fetchData, handlChange, handlKeyDownSearch, handleSignOut, formatNumber, session, nextphotos,handleLike })
          :
          <div className='m-6'>
            <Link  href={`/login`}><a className='bg-blue-500 p-3 text-white rounded-md'>Go to sign in</a></Link>
          </div>
        }
      </section>
    </div>
  )
}


// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req })

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login'
//       }
//     }
// }


//   return {
//     props: { session }
//   }
// }


export const getStaticProps = async () => {
  const res = await axios.get(`${apiEndPoint}/photos/random?client_id=${clientId}&count=30`)
  const { data } = res
  return {
    props: {
      data
    }
  }
}




