"use client";

import { motion } from "framer-motion";
import { RocketIcon, StarIcon, LightningBoltIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const features = [
  "Advanced AI Code Generation",
  "Real-time Collaboration",
  "Custom AI Training",
  "Priority Support",
  "Unlimited Projects",
  "API Access"
];

const pricingTiers = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for getting started",
    features: features.slice(0, 2),
    color: "from-gray-500 to-gray-600",
    popular: false
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Best for professionals",
    features: features.slice(0, 4),
    color: "from-blue-500 to-blue-600",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large teams",
    features: features,
    color: "from-purple-500 to-purple-600",
    popular: false
  }
];

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = (tier: string) => {
    router.push(`/dashboard?plan=${tier.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-2xl inline-block mb-6">
              <RocketIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Start Your AI Journey Today
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Choose the perfect plan for your needs and transform your development workflow with AI-powered assistance.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                tier.popular ? 'ring-2 ring-blue-500' : ''
              }`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6`}>
                {tier.name === "Basic" ? (
                  <StarIcon className="w-6 h-6 text-white" />
                ) : tier.name === "Pro" ? (
                  <RocketIcon className="w-6 h-6 text-white" />
                ) : (
                  <LightningBoltIcon className="w-6 h-6 text-white" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                {tier.period && (
                  <span className="text-gray-500 ml-1">{tier.period}</span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{tier.description}</p>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleGetStarted(tier.name)}
                className={`w-full ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                } py-3 rounded-xl transition-all duration-300`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you get started and make the most of our AI-powered platform.
          </p>
          <Button
            onClick={() => router.push('/contact')}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Contact Support
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}