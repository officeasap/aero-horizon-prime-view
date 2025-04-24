
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="pt-32 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            This Cookie Policy explains how our website uses cookies and similar technologies to provide you with a better browsing experience, analyze traffic, and personalize content and advertisements. By using our website, you agree to our use of cookies in accordance with this policy, unless you disable them through your browser settings.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies?</h2>
          <p className="mb-6">
            Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work, improve their efficiency, and provide valuable information to site owners. Cookies help websites remember your preferences, login information, and browsing behavior, ensuring a smoother and more personalized experience.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
          <p className="mb-4">We use several types of cookies on our website for different purposes:</p>
          
          <ol className="list-decimal pl-6 mb-6 space-y-4">
            <li>
              <strong>Essential Cookies:</strong>
              <p>
                These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas, and form submissions. Without these cookies, the site may not work as intended.
              </p>
            </li>
            
            <li>
              <strong>Performance Cookies:</strong>
              <p>
                These cookies collect information about how visitors use our website, such as which pages are most visited and if users receive error messages. The data is anonymous and helps us improve how the site works.
              </p>
            </li>
            
            <li>
              <strong>Functionality Cookies:</strong>
              <p>
                These cookies allow the website to remember choices you make, such as your username, language, or region. They provide enhanced, more personal features and can be used to provide services you've requested.
              </p>
            </li>
            
            <li>
              <strong>Targeting and Advertising Cookies:</strong>
              <p>
                These cookies track your browsing habits across different websites and help us deliver personalized advertising relevant to your interests. They may be set by us or by third-party advertising partners.
              </p>
            </li>
            
            <li>
              <strong>Analytics Cookies:</strong>
              <p>
                We use analytics tools such as Google Analytics to understand how users interact with our website. These cookies collect aggregated data and help us identify trends to enhance the overall user experience.
              </p>
            </li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
          <p className="mb-6">
            Our website may include content and services from third parties, such as embedded videos, social media sharing buttons, or affiliate links. These third parties may also use cookies to collect data. We do not have control over these cookies, so we recommend reviewing the cookie policies of these third-party providers.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookie Duration</h2>
          <p className="mb-6">
            Cookies can be either "session" cookies or "persistent" cookies:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Session cookies are temporary and deleted once you close your browser.</li>
            <li>Persistent cookies remain on your device until they expire or are deleted manually.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Managing and Disabling Cookies</h2>
          <p className="mb-6">
            You can control and manage cookies through your browser settings. Most browsers allow you to refuse or delete cookies entirely. However, please note that disabling cookies may affect the functionality of our website and limit your user experience.
          </p>
          
          <p className="mb-6">
            To manage cookies:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Check your browser's help section.</li>
            <li>Use built-in tools like "Clear Browsing Data" or "Privacy & Security Settings."</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business operations. We encourage you to revisit this page periodically to stay informed.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us through our <a href="/contact" className="text-[#8B0000] hover:underline">support or contact page</a>.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
