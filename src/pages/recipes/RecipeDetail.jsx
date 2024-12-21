import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { recipeService } from '../../services/recipeService';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    recipeCategoryId: '',
  });
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getRecipe(id);
      setRecipe(data);
      setEditForm({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        recipeCategoryId: data.recipeCategoryId,
      });
      console.log(data.comments)
      setComments(data.comments);
    } catch (err) {
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key]);
      });
      
      await recipeService.updateRecipe(id, formData);
      setEditDialogOpen(false);
      loadRecipe();
    } catch (err) {
      setError('Không thể cập nhật bài viết');
    }
  };

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      setError('Không thể xóa bài viết');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await recipeService.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Không thể xóa bình luận');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!recipe) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Không tìm thấy bài viết
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {recipe.title}
        </Typography>
        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Sửa
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Xóa
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Nguyên liệu
          </Typography>
          <Typography paragraph>{recipe.ingredients}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Hướng dẫn
          </Typography>
          <Typography paragraph>{recipe.instructions}</Typography>
        </Grid>

        {recipe.mediaUrls?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Hình ảnh
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {recipe.mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Hình ảnh ${index + 1}`}
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                />
              ))}
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Đăng bởi: {recipe.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ngày đăng: {new Date(recipe.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Bình luận
          </Typography>
          <Box sx={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', p: 1 }}>
            <List>
              {comments.map(comment => (
                <ListItem key={comment.id}>
                  <ListItemText primary={comment.content} secondary={`Đăng bởi: ${comment.userName}`} />
                  <Button onClick={() => handleDeleteComment(comment.id)} color="error">Xóa</Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

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

export default RecipeDetail; 