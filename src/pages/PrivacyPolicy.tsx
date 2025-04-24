
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="pt-32 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            We care about your privacy. This policy explains what we collect, why we collect it, and how we use it. 
            It also tells you what choices you have.
          </p>
          
          <p className="mb-6">
            By using our site, you agree to this policy. If you don't agree, please don't use the site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Collect</h2>
          
          <p className="mb-4">We collect a few types of information:</p>
          
          <ol className="list-decimal pl-6 mb-6 space-y-4">
            <li>
              <strong>Info you give us:</strong>
              <p>
                This includes things like your name, email, or anything you type in a form. 
                If you sign up, buy something, or contact us, we store that info.
              </p>
            </li>
            
            <li>
              <strong>Info we get from your use of the site:</strong>
              <p>
                When you visit, we may collect data like:
              </p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>The pages you view</li>
                <li>Your device type and browser</li>
                <li>Your IP address</li>
                <li>What site you came from</li>
                <li>Cookies (small files saved on your device)</li>
              </ul>
            </li>
            
            <li>
              <strong>Optional info:</strong>
              <p>
                Sometimes we ask for extra info—like preferences or feedback. You don't have to give it.
              </p>
            </li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why We Collect It</h2>
          <p className="mb-4">We collect your info to:</p>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Run the site and keep it working</li>
            <li>Help you create and manage your account</li>
            <li>Send updates, alerts, or support replies</li>
            <li>Improve your experience</li>
            <li>Understand how people use the site</li>
            <li>Show you relevant offers or ads (if any)</li>
            <li>Follow the law</li>
          </ul>
          
          <p className="mb-6">We never collect more than we need.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies to make the site work better. Cookies help us remember things like your login 
            or what's in your cart. Some cookies also help us see how the site's being used.
          </p>
          
          <p className="mb-4">
            You can turn off cookies in your browser, but some parts of the site might not work right if you do.
          </p>
          
          <p className="mb-6">
            We may also use tools like Google Analytics or Facebook Pixel. These tools track user actions 
            and help us improve the site. They may set cookies or collect info, too.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Sharing Your Info</h2>
          <p className="mb-4">We don't sell your data. Period.</p>
          
          <p className="mb-4">We only share it when:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>You say it's okay</li>
            <li>A service provider needs it to help us (like a payment processor or email tool)</li>
            <li>The law requires it</li>
            <li>We need to protect our site or users</li>
          </ul>
          
          <p className="mb-6">
            Anyone we share it with must follow privacy rules too.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Protect It</h2>
          <p className="mb-6">
            We use security tools to guard your info—things like encryption and secure servers. But no system is perfect. 
            If something goes wrong, we'll tell you as soon as possible and do our best to fix it.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How Long We Keep It</h2>
          <p className="mb-6">
            We keep your info as long as we need it for the reasons listed above. If you delete your account or ask us to 
            delete your data, we'll do that unless we're legally required to keep it.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Choices</h2>
          <p className="mb-4">You're in control. You can:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Ask to see what info we have</li>
            <li>Ask us to fix or delete it</li>
            <li>Turn off cookies in your browser</li>
            <li>Unsubscribe from emails</li>
          </ul>
          
          <p className="mb-6">To make any of these requests, just contact us.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links</h2>
          <p className="mb-6">
            Our site may link to other sites. We're not responsible for their privacy practices. 
            Always read their privacy policies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kids' Privacy</h2>
          <p className="mb-6">
            We don't knowingly collect data from kids under 13. If you're a parent and think your child gave us info, 
            let us know. We'll delete it.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
          <p className="mb-6">
            We might update this policy now and then. If we do, we'll post the new version here. 
            Keep checking back if you want to stay informed. Using the site after changes means you accept the new policy.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            Questions? Reach out through our <a href="/contact" className="text-[#8B0000] hover:underline">contact page</a> or email. We're here to help.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
