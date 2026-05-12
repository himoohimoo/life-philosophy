import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, initBBSData, addPost, deletePost, updatePost, likePost, getComments, addComment, deleteComment, updateComment, likeComment } from '../utils/bbsData';
import { useUser } from '../contexts/UserContext';

export default function BbsPage({ category, title, icon }) {
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', location: '', priceRange: '' });
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editPostData, setEditPostData] = useState({ title: '', content: '', tags: '', location: '', priceRange: '' });
  
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    initBBSData();
    setPosts(getPosts(category));
  }, [category]);
  
  // 过滤帖子
  const filteredPosts = searchKeyword 
    ? posts.filter(p => 
        p.title.includes(searchKeyword) || 
        p.content.includes(searchKeyword) ||
        (p.tags && p.tags.some(t => t.includes(searchKeyword)))
      )
    : posts;
  
  // 创建新帖子
  const handleCreatePost = () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('请填写标题和内容');
      return;
    }
    
    const post = addPost(category, {
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      location: newPost.location,
      priceRange: newPost.priceRange
    }, user.username);
    
    setPosts(getPosts(category));
    setShowNewPost(false);
    setNewPost({ title: '', content: '', tags: '', location: '', priceRange: '' });
    setExpandedPost(post.id);
  };
  
  // 删除帖子
  const handleDeletePost = (postId) => {
    if (!confirm('确定删除这个帖子吗？')) return;
    deletePost(postId);
    setPosts(getPosts(category));
    setExpandedPost(null);
  };
  
  // 编辑帖子
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditPostData({
      title: post.title,
      content: post.content,
      tags: (post.tags || []).join(', '),
      location: post.location || '',
      priceRange: post.priceRange || ''
    });
  };
  
  // 保存编辑帖子
  const handleSaveEditPost = () => {
    if (!editPostData.title.trim() || !editPostData.content.trim()) {
      alert('请填写标题和内容');
      return;
    }
    updatePost(editingPost.id, {
      title: editPostData.title,
      content: editPostData.content,
      tags: editPostData.tags.split(',').map(t => t.trim()).filter(Boolean),
      location: editPostData.location,
      priceRange: editPostData.priceRange
    });
    setEditingPost(null);
    setEditPostData({ title: '', content: '', tags: '', location: '', priceRange: '' });
    setPosts(getPosts(category));
  };
  
  // 点赞帖子
  const handleLikePost = (postId) => {
    likePost(postId);
    setPosts(getPosts(category));
  };
  
  // 提交评论
  const handleSubmitComment = (postId) => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (editingComment) {
      if (!commentContent.trim()) return;
      updateComment(editingComment.id, commentContent);
      setEditingComment(null);
      setCommentContent('');
    } else {
      if (!newComment.trim()) return;
      addComment(postId, newComment, user.username);
      setNewComment('');
    }
    // 强制刷新评论和帖子列表
    setPosts(getPosts(category));
    // 触发重新渲染以刷新评论
    setExpandedPost(postId);
    setTimeout(() => setExpandedPost(postId), 50);
  };
  
  // 编辑评论
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentContent(comment.content);
  };
  
  // 删除评论
  const handleDeleteComment = (commentId) => {
    if (!confirm('确定删除这条评论吗？')) return;
    deleteComment(commentId);
    setExpandedPost(expandedPost); // 刷新
  };
  
  // 点赞评论
  const handleLikeComment = (commentId) => {
    likeComment(commentId);
    setExpandedPost(expandedPost);
  };
  
  const comments = expandedPost ? getComments(expandedPost) : [];
  const currentPost = expandedPost ? posts.find(p => p.id === expandedPost) : null;
  
  return (
    <div className="bbs-page">
      <style>{`
        .bbs-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .bbs-header {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .bbs-header h1 {
          font-size: 28px;
          color: #fff;
          margin: 0 0 8px 0;
        }
        
        .bbs-header h1 span {
          margin-right: 12px;
        }
        
        .bbs-header p {
          color: #8892b0;
          margin: 0;
        }
        
        .bbs-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .bbs-search {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          border: 1px solid #2d3748;
          border-radius: 8px;
          background: #1a1a2e;
          color: #fff;
          font-size: 14px;
        }
        
        .bbs-search:focus {
          outline: none;
          border-color: #6366f1;
        }
        
        .bbs-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .bbs-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        
        .bbs-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        
        .bbs-btn-secondary {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        
        .bbs-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .bbs-btn-danger {
          background: #dc2626;
          color: #fff;
          padding: 8px 16px;
          font-size: 13px;
        }
        
        /* 新建帖子表单 */
        .bbs-new-post {
          background: #1a1a2e;
          border: 1px solid #2d3748;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }
        
        .bbs-new-post h3 {
          color: #fff;
          margin: 0 0 20px 0;
        }
        
        .bbs-form-group {
          margin-bottom: 16px;
        }
        
        .bbs-form-group label {
          display: block;
          color: #8892b0;
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .bbs-form-group input,
        .bbs-form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #2d3748;
          border-radius: 8px;
          background: #0f0f1a;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
        }
        
        .bbs-form-group textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .bbs-form-group input:focus,
        .bbs-form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
        }
        
        .bbs-form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        /* 帖子列表 */
        .bbs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .bbs-post-card {
          background: #1a1a2e;
          border: 1px solid #2d3748;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .bbs-post-card:hover {
          border-color: #6366f1;
          transform: translateX(4px);
        }
        
        .bbs-post-card.expanded {
          border-color: #6366f1;
        }
        
        .bbs-post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .bbs-post-title {
          font-size: 18px;
          color: #fff;
          margin: 0;
          font-weight: 600;
        }
        
        .bbs-post-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        
        .bbs-tag {
          padding: 4px 10px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .bbs-post-meta {
          display: flex;
          gap: 16px;
          color: #8892b0;
          font-size: 13px;
          margin-top: 12px;
        }
        
        .bbs-post-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .bbs-post-actions {
          display: flex;
          gap: 8px;
        }
        
        .bbs-action-btn {
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #8892b0;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .bbs-action-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        
        .bbs-action-btn.liked {
          color: #f43f5e;
        }
        
        /* 帖子详情 */
        .bbs-post-detail {
          background: #1a1a2e;
          border: 1px solid #6366f1;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }
        
        .bbs-post-detail-header {
          border-bottom: 1px solid #2d3748;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        
        .bbs-post-detail h2 {
          color: #fff;
          margin: 0 0 12px 0;
          font-size: 22px;
        }
        
        .bbs-post-detail-content {
          color: #cbd5e1;
          line-height: 1.8;
          white-space: pre-wrap;
          margin-bottom: 20px;
        }
        
        .bbs-post-info {
          display: flex;
          gap: 20px;
          color: #8892b0;
          font-size: 14px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }
        
        .bbs-close-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .bbs-back-btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        
        .bbs-back-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        
        /* 评论区域 */
        .bbs-comments {
          margin-top: 24px;
        }
        
        .bbs-comments h4 {
          color: #fff;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #2d3748;
        }
        
        .bbs-comment-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .bbs-comment-form textarea {
          flex: 1;
          padding: 12px;
          border: 1px solid #2d3748;
          border-radius: 8px;
          background: #0f0f1a;
          color: #fff;
          font-size: 14px;
          min-height: 60px;
          resize: vertical;
        }
        
        .bbs-comment-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .bbs-comment {
          background: rgba(255,255,255,0.02);
          border: 1px solid #2d3748;
          border-radius: 8px;
          padding: 16px;
        }
        
        .bbs-comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .bbs-comment-author {
          color: #a5b4fc;
          font-weight: 500;
          font-size: 14px;
        }
        
        .bbs-comment-time {
          color: #8892b0;
          font-size: 12px;
        }
        
        .bbs-comment-content {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        
        .bbs-comment-actions {
          display: flex;
          gap: 8px;
        }
        
        .bbs-edit-form {
          margin-top: 12px;
        }
        
        .bbs-edit-form textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #6366f1;
          border-radius: 6px;
          background: #0f0f1a;
          color: #fff;
          font-size: 14px;
          min-height: 60px;
          resize: vertical;
          margin-bottom: 8px;
        }
        
        .bbs-empty {
          text-align: center;
          padding: 60px 20px;
          color: #8892b0;
        }
        
        .bbs-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
      `}</style>
      
      {/* 头部 */}
      <div className="bbs-header">
        <h1><span>{icon}</span>{title}</h1>
        <p>分享发现，交流体验，发现身边的美好</p>
      </div>
      
      {/* 工具栏 */}
      <div className="bbs-toolbar">
        <input
          type="text"
          className="bbs-search"
          placeholder="搜索帖子..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {user && (
          <button className="bbs-btn bbs-btn-primary" onClick={() => setShowNewPost(!showNewPost)}>
            {showNewPost ? '取消发布' : '发布新帖'}
          </button>
        )}
      </div>
      
      {/* 新建帖子表单 */}
      {showNewPost && (
        <div className="bbs-new-post">
          <h3>📝 发布新帖</h3>
          <div className="bbs-form-group">
            <label>标题 *</label>
            <input
              type="text"
              placeholder="给帖子起个吸引人的标题"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
          </div>
          <div className="bbs-form-group">
            <label>内容 *</label>
            <textarea
              placeholder="分享你的体验和建议..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            />
          </div>
          <div className="bbs-form-group">
            <label>标签（用逗号分隔）</label>
            <input
              type="text"
              placeholder="例如：攻略, 推荐, 避坑"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
            />
          </div>
          {category === 'food' && (
            <>
              <div className="bbs-form-group">
                <label>地址</label>
                <input
                  type="text"
                  placeholder="推荐地点"
                  value={newPost.location}
                  onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                />
              </div>
              <div className="bbs-form-group">
                <label>人均消费</label>
                <input
                  type="text"
                  placeholder="例如：人均50元"
                  value={newPost.priceRange}
                  onChange={(e) => setNewPost({...newPost, priceRange: e.target.value})}
                />
              </div>
            </>
          )}
          <div className="bbs-form-actions">
            <button className="bbs-btn bbs-btn-secondary" onClick={() => setShowNewPost(false)}>取消</button>
            <button className="bbs-btn bbs-btn-primary" onClick={handleCreatePost}>发布</button>
          </div>
        </div>
      )}
      
      {/* 帖子列表 */}
      {expandedPost && (
        <div className="bbs-close-detail">
          <button className="bbs-back-btn" onClick={() => setExpandedPost(null)}>
            ← 返回帖子列表
          </button>
        </div>
      )}
      
      {expandedPost && currentPost ? (
        /* 帖子详情 */
        <div className="bbs-post-detail">
          <div className="bbs-post-detail-header">
            <h2>{currentPost.title}</h2>
            <div className="bbs-post-tags">
              {currentPost.tags && currentPost.tags.map((tag, i) => (
                <span key={i} className="bbs-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="bbs-post-detail-content">{currentPost.content}</div>
          <div className="bbs-post-info">
            <span>👤 {currentPost.author}</span>
            <span>🕐 {currentPost.time}</span>
            {currentPost.location && <span>📍 {currentPost.location}</span>}
            {currentPost.priceRange && <span>💰 {currentPost.priceRange}</span>}
            <span>❤️ {currentPost.likes} 点赞</span>
            {user && (user.username === currentPost.authorId || user.username === 'admin') && (
              <button className="bbs-action-btn" onClick={() => handleEditPost(currentPost)} style={{marginLeft: 'auto'}}>
                ✏️ 编辑帖子
              </button>
            )}
          </div>
          
          {/* 评论区域 */}
          <div className="bbs-comments">
            <h4>💬 评论 ({comments.length})</h4>
            
            {/* 评论表单 */}
            {user && !editingComment && (
              <div className="bbs-comment-form">
                <textarea
                  placeholder="发表评论..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="bbs-btn bbs-btn-primary" onClick={() => handleSubmitComment(expandedPost)}>
                  发送
                </button>
              </div>
            )}
            
            {/* 评论列表 */}
            <div className="bbs-comment-list">
              {comments.length === 0 ? (
                <div className="bbs-empty">
                  <div className="bbs-empty-icon">💬</div>
                  <p>还没有评论，来说点什么吧</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bbs-comment">
                    <div className="bbs-comment-header">
                      <span className="bbs-comment-author">{comment.author}</span>
                      <span className="bbs-comment-time">{comment.time}</span>
                    </div>
                    
                    {editingComment && editingComment.id === comment.id ? (
                      <div className="bbs-edit-form">
                        <textarea
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <button className="bbs-btn bbs-btn-primary" onClick={() => handleSubmitComment(expandedPost)}>保存</button>
                        <button className="bbs-btn bbs-btn-secondary" onClick={() => {setEditingComment(null); setCommentContent('');}}>取消</button>
                      </div>
                    ) : (
                      <>
                        <div className="bbs-comment-content">{comment.content}</div>
                        <div className="bbs-comment-actions">
                          <button 
                            className="bbs-action-btn" 
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            ❤️ {comment.likes}
                          </button>
                          {(user && (user.username === comment.authorId || user.username === 'admin')) && (
                            <>
                              <button 
                                className="bbs-action-btn" 
                                onClick={() => handleEditComment(comment)}
                              >
                                编辑
                              </button>
                              <button 
                                className="bbs-action-btn bbs-btn-danger" 
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                删除
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 帖子列表 */
        <div className="bbs-list">
          {filteredPosts.length === 0 ? (
            <div className="bbs-empty">
              <div className="bbs-empty-icon">📭</div>
              <p>{searchKeyword ? '没有找到相关帖子' : '暂无帖子，快来发布第一篇吧！'}</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div 
                key={post.id} 
                className={`bbs-post-card ${expandedPost === post.id ? 'expanded' : ''}`}
                onClick={() => setExpandedPost(post.id)}
              >
                <div className="bbs-post-header">
                  <div>
                    <h3 className="bbs-post-title">{post.title}</h3>
                    <div className="bbs-post-tags">
                      {post.tags && post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="bbs-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bbs-post-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="bbs-action-btn" 
                      onClick={() => handleLikePost(post.id)}
                    >
                      ❤️ {post.likes}
                    </button>
                    {user && (user.username === post.authorId || user.username === 'admin') && (
                      <>
                        <button 
                          className="bbs-action-btn" 
                          onClick={() => handleEditPost(post)}
                        >
                          ✏️ 编辑
                        </button>
                        <button 
                          className="bbs-action-btn bbs-btn-danger" 
                          onClick={() => handleDeletePost(post.id)}
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="bbs-post-meta">
                  <span>👤 {post.author}</span>
                  <span>🕐 {post.time}</span>
                  <span>💬 {post.replies} 评论</span>
                  {post.location && <span>📍 {post.location}</span>}
                  {post.priceRange && <span>💰 {post.priceRange}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* 编辑帖子弹窗 */}
      {editingPost && (
        <div className="modal-overlay" onClick={() => setEditingPost(null)}>
          <div className="modal-content" style={{maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingPost(null)}>✕</button>
            <h3 className="modal-title">✏️ 编辑帖子</h3>
            <div className="bbs-form-group" style={{marginTop: '20px'}}>
              <label>标题 *</label>
              <input
                type="text"
                value={editPostData.title}
                onChange={(e) => setEditPostData({...editPostData, title: e.target.value})}
              />
            </div>
            <div className="bbs-form-group">
              <label>内容 *</label>
              <textarea
                value={editPostData.content}
                onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}
                style={{minHeight: '200px'}}
              />
            </div>
            <div className="bbs-form-group">
              <label>标签（用逗号分隔）</label>
              <input
                type="text"
                value={editPostData.tags}
                onChange={(e) => setEditPostData({...editPostData, tags: e.target.value})}
              />
            </div>
            {category === 'food' && (
              <>
                <div className="bbs-form-group">
                  <label>地址</label>
                  <input
                    type="text"
                    value={editPostData.location}
                    onChange={(e) => setEditPostData({...editPostData, location: e.target.value})}
                  />
                </div>
                <div className="bbs-form-group">
                  <label>人均消费</label>
                  <input
                    type="text"
                    value={editPostData.priceRange}
                    onChange={(e) => setEditPostData({...editPostData, priceRange: e.target.value})}
                  />
                </div>
              </>
            )}
            <div className="bbs-form-actions">
              <button className="bbs-btn bbs-btn-secondary" onClick={() => setEditingPost(null)}>取消</button>
              <button className="bbs-btn bbs-btn-primary" onClick={handleSaveEditPost}>保存修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
