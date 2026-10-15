import React from 'react';
import { Users, MessageSquare, ThumbsUp } from 'lucide-react';

export default function Community() {
  const posts = [
    {
      author: 'Ramesh Patel (Warangal)',
      crop: 'Cotton',
      time: '2 hours ago',
      content: 'Has anyone tried neem oil 10,000 ppm spray for whitefly in cotton this season? Seeing great results after 3 days!',
      likes: 18,
      replies: 5,
    },
    {
      author: 'Srinivas Rao (Miryalaguda)',
      crop: 'Paddy',
      time: '5 hours ago',
      content: 'Warangal Mandi price for BPT 5204 paddy increased to ₹2,320/quintal today.',
      likes: 24,
      replies: 8,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-emerald-400" /> Farmer Community Forum
        </h1>
        <p className="text-xs text-slate-400 mt-1">Connect with fellow farmers, share field observations, and trade tips.</p>
      </div>

      <div className="space-y-4">
        {posts.map((post, idx) => (
          <div key={idx} className="glass-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white">{post.author}</span>
              <span>{post.time}</span>
            </div>
            <p className="text-sm text-slate-200">{post.content}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-2">
              <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-agri-400" /> {post.likes} Likes</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {post.replies} Replies</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
