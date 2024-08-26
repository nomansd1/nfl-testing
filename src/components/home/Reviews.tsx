import ReviewsCarousel from "./ReviewsCarousel";

export default function Reviews() {

  const reviews = [
    { id: 1, thumbnail: '/assets/c1.jpg', review: '', customerName: 'shiraz', location: 'germany' },
    { id: 2, thumbnail: '/assets/c2.jpg', review: '', customerName: 'uzair', location: 'china' },
    { id: 3, thumbnail: '/assets/c3.jpg', review: '', customerName: 'tahir', location: 'russia' },
    { id: 4, thumbnail: '/assets/c4.jpg', review: '', customerName: 'anas', location: 'qatar' },
    { id: 5, thumbnail: '/assets/c5.jpg', review: '', customerName: 'muneeb', location: 'UK' },
  ]

  return <ReviewsCarousel reviews={reviews} />
}
