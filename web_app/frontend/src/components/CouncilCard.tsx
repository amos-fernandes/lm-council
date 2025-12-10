
import React from 'react';

interface CouncilCardProps {
    model: string;
    content: string;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ model, content }) => {
    // Simple check for "high profile" branding or avatars could go here
    const getAvatar = (modelName: string) => {
        if (modelName.includes('gpt')) return '🤖';
        if (modelName.includes('claude')) return '🧠';
        if (modelName.includes('gemini')) return '✨';
        return '👾';
    };

    return (
        <div className="glass-panel p-4 rounded-xl m-2 flex-1 min-w-[300px] hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                <span className="text-2xl">{getAvatar(model)}</span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-300">
                    {model.split('/').pop()}
                </h3>
            </div>
            <div className="prose prose-invert text-sm max-h-96 overflow-y-auto custom-scrollbar">
                <p className="whitespace-pre-wrap">{content}</p>
            </div>
        </div>
    );
};
