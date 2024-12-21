import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    recipeCategoryId: '',
    isApproved: false,
    mediaUrls: [],
    removedMediaUrls: [],
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await recipeService.getAllRecipes();
      setPosts(data);
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      ingredients: post.ingredients,
      instructions: post.instructions,
      recipeCategoryId: post.recipeCategoryId,
      isApproved: post.isApproved,
      mediaUrls: [...post.mediaUrls],
      removedMediaUrls: [],
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const handleApprove = async (id) => {
    try {
      await recipeService.approveRecipe(id);
      loadPosts();
    } catch (err) {
      setError('Không thể duyệt bài viết');
    }
  };

  const handleRemoveImage = (urlToRemove) => {
    setEditForm(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter(url => url !== urlToRemove),
      removedMediaUrls: [...prev.removedMediaUrls, urlToRemove],
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipeDto = {
        title: editForm.title,
        ingredients: editForm.ingredients,
        instructions: editForm.instructions,
        mediaUrls: editForm.mediaUrls,
        removedMediaUrls: editForm.removedMediaUrls,
        isApproved: editForm.isApproved
      };

      await recipeService.updateRecipe(selectedPost.id, recipeDto);
      setEditDialogOpen(false);
      loadPosts();
    } catch (err) {
      console.error('Update error:', err);
      setError('Không thể cập nhật bài viết');
    }
  };

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(selectedPost.id);
      setDeleteDialogOpen(false);
      loadPosts();
    } catch (err) {
      setError('Không thể xóa bài viết');
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          Danh sách bài viết
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Người đăng</TableCell>
              <TableCell>Ngày đăng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.userName}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
                    color={post.isApproved ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => navigate(`/recipes/${post.id}`)}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditClick(post)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(post)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  {!post.isApproved && (
                    <IconButton
                      onClick={() => handleApprove(post.id)}
                      color="success"
                      size="small"
                    >
                      <CheckIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEditSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Tiêu đề"
              name="title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Nguyên liệu"
              name="ingredients"
              value={editForm.ingredients}
              onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Hướng dẫn"
              name="instructions"
              value={editForm.instructions}
              onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editForm.isApproved}
                  onChange={(e) => setEditForm({ ...editForm, isApproved: e.target.checked })}
                  name="isApproved"
                />
              }
              label="Đã duyệt"
              sx={{ mt: 1 }}
            />

            {/* Image Gallery */}
            {editForm.mediaUrls.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Hình ảnh
                </Typography>
                <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} rowHeight={200}>
                  {editForm.mediaUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Hình ảnh ${index + 1}`}
                        loading="lazy"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        sx={{
                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => handleRemoveImage(url)}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa bài viết này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PostList; 