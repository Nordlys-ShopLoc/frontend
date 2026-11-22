import Hero from '../components/Hero.jsx'
import ShopList from '../components/ShopList.jsx'

// Home page: presentation and public list of the partner shops
export default function HomePage({ loggedIn }) {
  return (
    <>
      <Hero loggedIn={loggedIn} />
      <ShopList />
    </>
  )
}
