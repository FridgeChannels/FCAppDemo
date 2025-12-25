import Image from 'next/image';

export interface ChannelHeaderProps {
  imageUrl: string; // from API
  name: string; // from API
  description: string; // from API
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 pt-3 sm:pt-8 pb-2.5 sm:pb-6">
        <div className="flex items-start gap-3 sm:gap-6">
          <div className="shrink-0">
            <div className="bg-white rounded-sm overflow-hidden">
              <Image
                src={imageUrl}
                alt={`${name} channel`}
                width={64}
                height={64}
                className="h-12 w-12 sm:h-20 sm:w-20 object-contain"
                priority
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="text-lg sm:text-4xl font-semibold text-black leading-tight break-words"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {name}
            </h1>
            <p
              className="mt-1 text-[12px] sm:text-base text-gray-700 leading-snug break-words"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200" />
    </div>
  );
};
