import { Navbar } from '@/components/navbar/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/footer/footer'


import { UIProvider } from '@/components/providers/ui-provider'
import { FeaturedRestaurants } from '@/components/home/featured-restaurants'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
 
      <UIProvider>
    
    
        <main>
          <HeroSection />
           <FeaturedRestaurants></FeaturedRestaurants>
            <TestimonialsSection></TestimonialsSection>
             <CTASection />
        </main>

      </UIProvider>
    </div>
  )
}