'use client';

import { SITES } from '@/common/sites';
import { protectedClientPage } from '@/components/protectedClientPage';
import { AdminPanelSettings, Groups, Home, Menu as MenuIcon, OpenInNew } from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';

const DRAWER_WIDTH = 260;
const ACCESS_SEGMENT = 'access';

function UserIcon({ user }: { user: User }) {
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

    return (
        <>
            <Tooltip title="Account">
                <IconButton onClick={(e) => setAnchorElement(e.currentTarget)}>
                    <Avatar alt="user-icon" src={user.image} />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorElement} open={!!anchorElement} onClose={() => setAnchorElement(null)}>
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</MenuItem>
            </Menu>
        </>
    );
}

function Navigation({ segment, onNavigate }: { segment: string | null, onNavigate?: () => void }) {
    return (
        <List onClick={onNavigate}>
            <ListSubheader>Websites</ListSubheader>
            {SITES.map((site) => (
                <ListItemButton key={site.slug} component={Link} href={`/edit/${site.slug}`} selected={segment === site.slug}>
                    <ListItemIcon>{site.chorusId ? <Groups /> : <Home />}</ListItemIcon>
                    <ListItemText primary={site.name} />
                </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListSubheader>Settings</ListSubheader>
            <ListItemButton component={Link} href={`/edit/${ACCESS_SEGMENT}`} selected={segment === ACCESS_SEGMENT}>
                <ListItemIcon><AdminPanelSettings /></ListItemIcon>
                <ListItemText primary="Editor access" />
            </ListItemButton>
        </List>
    );
}

const EditLayout = protectedClientPage<PropsWithChildren>(({ user, children }) => {
    const segment = useSelectedLayoutSegment();
    const site = SITES.find(({ slug }) => slug === segment);

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar variant="dense" sx={{ gap: 2 }}>
                    <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ display: { md: 'none' } }} aria-label="Open menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        {site?.name ?? (segment === ACCESS_SEGMENT ? 'Editor access' : 'Edit')}
                    </Typography>
                    {site && (
                        <Button href={site.publicPath} target="_blank" endIcon={<OpenInNew />} color="inherit">
                            View page
                        </Button>
                    )}
                    <UserIcon user={user} />
                </Toolbar>
            </AppBar>
            {/* Temporary drawer for small screens, permanent sidebar for larger ones */}
            <Drawer
                variant="temporary"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                sx={{ 'display': { md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
            >
                <Navigation segment={segment} onNavigate={() => setMobileDrawerOpen(false)} />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{ 'display': { xs: 'none', md: 'block' }, 'width': DRAWER_WIDTH, 'flexShrink': 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
            >
                <Toolbar variant="dense" />
                <Navigation segment={segment} />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
                <Toolbar variant="dense" />
                {children}
            </Box>
        </Box>
    );
});

export default EditLayout;
