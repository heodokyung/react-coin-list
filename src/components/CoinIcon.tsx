import { useState } from 'react';
import styled from 'styled-components';

const IconWrap = styled.span<{ size: number }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	min-width: ${(props) => props.size}px;
	border-radius: 50%;
	overflow: hidden;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: ${(props) => props.theme.badgeBgColor};
	border: 1px solid ${(props) => props.theme.borderColor};
	color: ${(props) => props.theme.accentColor};
	font-size: ${(props) => Math.max(11, Math.floor(props.size * 0.32))}px;
	font-weight: 800;
	letter-spacing: 0.02em;
`;

const IconImg = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

interface CoinIconProps {
	image?: string;
	symbol: string;
	name: string;
	size?: number;
}

function CoinIcon({ image, symbol, name, size = 40 }: CoinIconProps) {
	const [imageFailed, setImageFailed] = useState(false);
	const fallbackText = (symbol || name || '?').slice(0, 3).toUpperCase();

	return (
		<IconWrap size={size} aria-label={`${name} 로고`} title={name}>
			{image && !imageFailed ? (
				<IconImg src={image} alt='' loading='lazy' onError={() => setImageFailed(true)} />
			) : (
				fallbackText
			)}
		</IconWrap>
	);
}

export default CoinIcon;
