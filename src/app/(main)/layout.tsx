'use client';

import { CenterLoader } from "@/src/components/CenterLoader";
import TopLinerLoader from "@/src/components/TopLineLoader";
import AppSidebar from "@/src/layout/AppSiderbar";
import { LayoutWrapper } from "@/src/layout/LayoutWrapper";
import { AppDispatch, RootState } from "@/src/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    return <React.Fragment>
        <LayoutWrapper>
            <TopLinerLoader />
            <div className="wrapper flex"
                style={{
                    height: "100vh"
                }}>
                <AppSidebar />
                <div style={{ width: '100vw' }} className={'page-container'}>
                    {children}
                </div>
            </div>
        </LayoutWrapper>
    </React.Fragment>
}
