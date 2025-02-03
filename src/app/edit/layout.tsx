'use client';

import { protectedClientPage } from '@/components/protectedClientPage';
import {
    AppBar,
    Avatar,
    Box,
    capitalize,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Article, Dashboard, Event, People, Person, SvgIconComponent } from '@mui/icons-material';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

function DrawerLink({ value, icon: Icon, children }: PropsWithChildren<{ value: string, icon?: SvgIconComponent }>) {
    const router = useRouter();

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={() => router.push(`/edit/${value}`)}>
                <ListItemIcon>
                    {Icon && <Icon />}
                </ListItemIcon>
                <ListItemText>{children}</ListItemText>
            </ListItemButton>
        </ListItem>
    );
}

function UserIcon({ user }: { user: User}) {
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

    return (
        <>
            <Tooltip title="Account">
                <IconButton onClick={(e) => setAnchorElement(e.currentTarget)}>
                    <Avatar alt="user-icon" src={user.image} />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorElement} open={!!anchorElement} onClose={() => setAnchorElement(null)}>
                <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <Typography sx={{ textAlign: 'center' }}>Sign Out</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

const EditPage = protectedClientPage<PropsWithChildren>(({ user, children }) => {
    const path = useSelectedLayoutSegment();

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense" sx={{ gap: 2 }}>
                    <IconButton onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {path ? capitalize(path) : 'Edit'}
                    </Typography>
                    <UserIcon user={user} />
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List onClick={() => setDrawerOpen(false)}>
                        <DrawerLink value="" icon={Dashboard}>Dashboard</DrawerLink>
                        <DrawerLink value="content" icon={Article}>Content</DrawerLink>
                        <DrawerLink value="people" icon={Person}>People</DrawerLink>
                        <DrawerLink value="quartets" icon={People}>Quartets</DrawerLink>
                        <DrawerLink value="events" icon={Event}>Events</DrawerLink>
                    </List>
                </Box>
            </Drawer>
            {children}
        </>
    );
});

export default EditPage;
