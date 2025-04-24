
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="pt-32 pb-12 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            Welcome to our site. By using it, you agree to follow these terms. If you don't agree, please don't use our site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Who Can Use Our Site</h2>
          <p className="mb-6">
            You need to be at least 13 years old. If you're under 18, you should only use the site with a parent or guardian's permission. 
            When you sign up or use our services, you promise the info you give is true and up to date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Account</h2>
          <p className="mb-6">
            If you create an account, keep your login details safe. You're responsible for what happens on your account, 
            even if you didn't do it. If you think someone got into your account, tell us right away.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What You Can't Do</h2>
          <p className="mb-4">
            Don't break the law. Don't copy, change, or sell anything from our site unless we say you can. Don't upload harmful content like viruses, 
            spam, or anything that steals data. Don't mess with our servers or try to access parts of the site you shouldn't.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Content</h2>
          <p className="mb-4">
            If you post, upload, or share content (like text, comments, or files), you still own it. But by posting it, 
            you give us permission to use it on our site. That means we can show, copy, or share it in ways that help the site work or grow. 
            We won't claim it's ours, but we can use it.
          </p>
          
          <p className="mb-6">
            Make sure your content doesn't break any laws or rights. If it does, we may remove it or block your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Content</h2>
          <p className="mb-6">
            All the stuff we made—like our design, text, logos, code, and features—belongs to us or the people we work with. 
            You can't copy or use it without permission.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Payments and Subscriptions</h2>
          <p className="mb-6">
            If you buy something or sign up for a paid plan, you agree to pay the price shown. All payments are final unless we clearly say otherwise. 
            If you cancel a subscription, you may still have access until the end of your billing period, but no refunds will be given.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to the Site</h2>
          <p className="mb-6">
            We may change or stop parts of the site at any time. We try to give notice when we can, but we don't have to. 
            We're not responsible if the site is down or parts don't work.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Ending Your Account</h2>
          <p className="mb-6">
            You can delete your account anytime. We can also suspend or delete it if you break the rules or cause harm to the site or others.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Limits on Liability</h2>
          <p className="mb-6">
            We do our best to keep things running and secure. But we can't promise everything will always work perfectly. 
            We're not responsible for any loss or damage caused by using the site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to These Terms</h2>
          <p className="mb-6">
            We may update these terms now and then. If we do, we'll post the new version here. By continuing to use the site, you accept the changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            Have questions about these terms? Reach out to us through our <a href="/contact" className="text-[#8B0000] hover:underline">contact page</a>. We're happy to help.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
