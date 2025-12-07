"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Wallet, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function TravelPlanDetails({ plan }: { plan: any }) {
    const {
        destination,
        startDate,
        endDate,
        budgetRange,
        travelType,
        description,
        visibility,
        user,
    } = plan;

    return (
        <div className="pb-20">
            <div className="relative flex items-center justify-center h-[320px] w-full bg-black">
                <Image
                    src={'/images/bg-banner/travel-plans.jpg'}
                    alt="travel details image"
                    fill
                    className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="z-10 relative text-white max-w-2xl px-4">
                    <h1 className="text-3xl font-bold mb-2">{destination}</h1>
                    <p className="text-sm opacity-90">
                        A planned journey hosted by <span className="font-semibold">{user?.name}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-14 relative z-20">
                {/* Main Card */}
                <Card className="shadow-lg border border-gray-200 rounded-xl">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Host Section */}
                            <div className="md:col-span-1">
                                <h2 className="text-lg font-semibold mb-4">Hosted By</h2>
                                <Card className="p-4 text-center border rounded-xl shadow-sm gap-2">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <Image
                                            src={user?.profileImage || "/default-avatar.png"}
                                            alt={user?.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>

                                    <h3 className="font-semibold text-lg">{user?.name}</h3>

                                    {user?.verifiedBadge && (
                                        <Badge className="mt-2 bg-blue-600">Verified</Badge>
                                    )}

                                    <p className="text-sm text-gray-500">{user?.email}</p>

                                    <Link href={'/'}>
                                        <Button variant={'outline'}>Visit Profile</Button>
                                    </Link>
                                </Card>
                                <Button className="cursor-pointer mt-3 w-full">Join With {user?.name}</Button>

                            </div>

                            {/* Travel Details */}
                            <div className="md:col-span-2 space-y-6">
                                <h2 className="text-lg font-semibold mb-2">Travel Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailItem
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Destination"
                                        value={destination}
                                    />

                                    <DetailItem
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Start Date"
                                        value={new Date(startDate).toDateString()}
                                    />

                                    <DetailItem
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="End Date"
                                        value={new Date(endDate).toDateString()}
                                    />

                                    <DetailItem
                                        icon={<Wallet className="w-4 h-4" />}
                                        label="Budget Range"
                                        value={budgetRange || "Not specified"}
                                    />

                                    <DetailItem
                                        icon={<User className="w-4 h-4" />}
                                        label="Travel Type"
                                        value={travelType}
                                    />

                                    <DetailItem
                                        icon={visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        label="Visibility"
                                        value={visibility ? "Public" : "Private"}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">About This Trip</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* Reusable UI Component */
function DetailItem({
    icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
            <div className="flex items-center gap-2 text-gray-700">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="mt-1 text-gray-900 font-semibold">{value}</p>
        </div>
    );
}
