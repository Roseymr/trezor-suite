import React, { useState, forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { Translation } from '@suite-components';
import { useTheme, Icon, variables } from '@trezor/components';
import { Account } from '@wallet-types';
import { AnimationWrapper } from './AnimationWrapper';

const Wrapper = styled.div`
    background: ${props => props.theme.BG_WHITE};
`;

const HeaderWrapper = styled.div`
    position: sticky;
    top: 0;
    background: ${props => props.theme.BG_WHITE};
`;

const ChevronIcon = styled(Icon)`
    padding: 12px;
    border-radius: 50%;
    transition: background 0.2s;
`;

const Header = styled.header<{ isOpened: boolean; onClick?: () => void }>`
    display: flex;
    padding: 16px;
    cursor: ${props => (props.onClick ? 'pointer' : 'default')};
    justify-content: space-between;
    align-items: center;
    height: 50px; /* otherwise it jumps on hiding arrow_down/up icon */

    text-transform: uppercase;
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_DARK_GREY};
    border-top: 1px solid ${props => props.theme.STROKE_GREY};

    :hover {
        ${ChevronIcon} {
            background: ${({ theme }) => theme.BG_GREY};
        }
    }
`;

interface AccountGroupProps {
    type: Account['accountType'];
    keepOpened: boolean;
    hasBalance: boolean;
    children?: React.ReactNode;
    onUpdate?: () => void;
}

const getGroupLabel = (type: AccountGroupProps['type']) => {
    if (type === 'coinjoin') return 'TR_COINJOIN_ACCOUNTS';
    if (type === 'taproot') return 'TR_TAPROOT_ACCOUNTS';
    if (type === 'legacy') return 'TR_LEGACY_ACCOUNTS';
    if (type === 'ledger') return 'TR_CARDANO_LEDGER_ACCOUNTS';
    return 'TR_LEGACY_SEGWIT_ACCOUNTS';
};

export const AccountGroup = forwardRef(
    (props: AccountGroupProps, _ref: React.Ref<HTMLDivElement>) => {
        const theme = useTheme();
        const hasHeader = props.type !== 'normal';
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [expanded, setExpanded] = useState(
            props.hasBalance || props.keepOpened || !hasHeader,
        );
        const isOpened = expanded || props.keepOpened || !hasHeader;
        const [animatedIcon, setAnimatedIcon] = useState(false);

        React.useEffect(() => {
            // follow props change (example: add new coin/account which has balance but group is closed)
            if (props.keepOpened || props.hasBalance) {
                setExpanded(true);
            }
        }, [props.keepOpened, props.hasBalance]);

        const onClick = () => {
            setExpanded(!expanded);
            setAnimatedIcon(true);
        };

        // Group needs to be wrapped into container (div)
        return (
            <Wrapper ref={wrapperRef}>
                {hasHeader && (
                    <HeaderWrapper>
                        <Header
                            isOpened={isOpened}
                            onClick={!props.keepOpened ? onClick : undefined}
                            data-test={`@account-menu/${props.type}`}
                        >
                            <Translation id={getGroupLabel(props.type)} />
                            {!props.keepOpened && (
                                <ChevronIcon
                                    data-test="@account-menu/arrow"
                                    canAnimate={animatedIcon}
                                    isActive={isOpened}
                                    size={16}
                                    color={theme.TYPE_LIGHT_GREY}
                                    icon="ARROW_DOWN"
                                />
                            )}
                        </Header>
                    </HeaderWrapper>
                )}
                <AnimationWrapper opened={isOpened} onUpdate={props.onUpdate}>
                    {props.children}
                </AnimationWrapper>
            </Wrapper>
        );
    },
);