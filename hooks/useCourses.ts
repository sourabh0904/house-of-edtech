import { useCallback, useEffect, useState } from 'react';
import { Course } from '../components/course/CourseCard';
import api from '../services/api';
import { useCourseStore } from '../store/courseStore';

export function useCourses() {
  const setCourses = useCourseStore((state) => state.setCourses);
  const courses = useCourseStore((state) => state.courses);
  
  const [loading, setLoading] = useState(courses.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh && courses.length === 0) setLoading(true);
      setError(null);

      // Fetch random users for instructors
      const usersResponse = await api.get('/public/randomusers?page=1&limit=10');
      const productsResponse = await api.get('/public/randomproducts?page=1&limit=10');

      const users = usersResponse.data.data.data;
      const products = productsResponse.data.data.data;

      // Transform and combine data
      const transformedCourses: Course[] = products.map((product: any, index: number) => {
        const instructor = users[index % users.length]; 
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          thumbnail: product.thumbnail,
          price: product.price,
          instructor: {
            name: `${instructor.name.first} ${instructor.name.last}`,
            avatar: instructor.picture.medium,
          },
          // isBookmarked status is handled by the store's setCourses to preserve existing bookmarks
        };
      });

      setCourses(transformedCourses);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (courses.length === 0) {
        fetchData();
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
  }, []);

  return { courses, loading, error, refreshing, onRefresh };
}
