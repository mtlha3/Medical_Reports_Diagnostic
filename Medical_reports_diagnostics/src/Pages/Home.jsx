import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Upload, ArrowRight, Zap, Heart, Brain, Activity } from "lucide-react"
import api from "../api/api";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [fileInputRef, setFileInputRef] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setUser(res.data.user);
          console.log("Fetched user:", res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/all");
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedBlog) return;
      try {
        const res = await api.get(`/blogs/${selectedBlog.blogId}/comments`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [selectedBlog]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText && commentRating === 0) return;

    try {
      await api.post(`/blogs/${selectedBlog.blogId}/comment`, {
        text: commentText || null,
        rating: commentRating || null,
      });

      setCommentText("");
      setCommentRating(0);

      const res = await api.get(`/blogs/${selectedBlog.blogId}/comments`);
      setComments(res.data.comments || []);
      const updatedBlogRes = await api.get(`/blogs/all`);
      setBlogs(updatedBlogRes.data.blogs || []);
    } catch (err) {
      alert(err.response?.data?.message || "Please login to comment/rate.");
    }
  };



  const sanitizeQuillHtml = (html) => {
    return html.replace(/<span class="ql-ui" contenteditable="false"><\/span>/g, "");
  };


  const healthTipsBlogs = blogs.filter(b => b.typeOfBlog === "healthTips");
  const infoBlogs = blogs.filter(b => b.typeOfBlog === "information");
  const storyBlogs = blogs.filter(b => b.typeOfBlog === "story");

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const renderBlogCard = (blog) => {

    return (
      <div
        key={blog.blogId}
        className="relative p-4 border rounded shadow hover:shadow-lg bg-slate-800 text-white cursor-pointer group overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedBlog(blog)}
      >
        <h3 className="text-xl font-semibold z-10 relative">{blog.title}</h3>

        {isHovered && blog.image?.data && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-full ml-4 w-64 h-40 rounded-lg overflow-hidden shadow-lg z-50"
          >
            <img
              src={`data:${blog.image.contentType};base64,${btoa(
                String.fromCharCode(...new Uint8Array(blog.image.data.data))
              )}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    )
  }

  // const textVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: (i) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       delay: i * 0.1,
  //       duration: 0.8,
  //       ease: "easeOut",
  //     },
  //   }),
  // }

  // const orbitVariants = {
  //   animate: (angle) => ({
  //     x: Math.cos(angle) * 120,
  //     y: Math.sin(angle) * 120,
  //     rotate: angle,
  //     transition: {
  //       duration: 20,
  //       repeat: Number.POSITIVE_INFINITY,
  //       ease: "linear",
  //     },
  //   }),
  // }

  const morphVariants = {
    animate: {
      borderRadius: [
        "30% 70% 70% 30% / 30% 30% 70% 70%",
        "70% 30% 46% 54% / 30% 30% 70% 70%",
        "30% 30% 70% 70% / 30% 70% 70% 30%",
        "30% 70% 70% 30% / 30% 70% 70% 30%",
      ],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const particleVariants = {
    animate: (delay) => ({
      y: [0, -100, 0],
      opacity: [0, 1, 0],
      transition: {
        delay,
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  }

  // const pulseWaveVariants = {
  //   animate: {
  //     scale: [1, 2, 3],
  //     opacity: [1, 0.5, 0],
  //     transition: {
  //       duration: 2,
  //       repeat: Number.POSITIVE_INFINITY,
  //       ease: "easeOut",
  //     },
  //   },
  // }

  const floatingCardVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(6, 182, 212, 0.3)",
        "0 0 40px rgba(6, 182, 212, 0.6)",
        "0 0 20px rgba(6, 182, 212, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const features = [
    { icon: Brain, text: "AI Analysis", color: "from-blue-400 to-cyan-400" },
    { icon: Heart, text: "Accurate Reports", color: "from-red-400 to-pink-400" },
    { icon: Activity, text: "Real-time Results", color: "from-emerald-400 to-green-400" },
  ]

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full filter blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="animate"
            custom={i * 0.3}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        <motion.div className="w-full max-w-5xl mx-auto text-center">

          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 backdrop-blur-xl cursor-pointer"
            whileHover={{ scale: 1.1, borderColor: "rgba(34, 197, 94, 0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-medium text-cyan-300">AI-Powered Medical Intelligence</span>
          </motion.div>

          <div className="space-y-6 mb-12">
            <motion.h1
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Diagnose Smarter
              </motion.span>
              <br />
              <motion.span
                className="inline-block mt-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Heal Faster
                </span>
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Upload medical reports and receive instant AI-powered insights. Professional diagnosis powered by advanced
              machine learning.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.button
              className="group relative px-10 py-5 rounded-xl font-bold text-lg overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              variants={glowVariants}
              animate="animate"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0"
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 bg-cyan-300"
                initial={{ x: "-100%" }}
                animate={{ x: isHovering ? "100%" : "-100%" }}
                transition={{ duration: 0.4 }}
              />
              <div className="relative flex items-center justify-center gap-3 text-slate-950">
                <motion.div animate={{ y: isHovering ? -3 : 0 }} transition={{ duration: 0.2 }}>
                  <Upload className="w-6 h-6" />
                </motion.div>
                <span>Upload Report</span>
                <motion.div
                  animate={{ x: isHovering ? 5 : 0, opacity: isHovering ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.button>

            <motion.button
              className="group relative px-10 py-5 rounded-xl font-bold text-lg backdrop-blur-xl border-2 border-cyan-400/50 text-cyan-300 overflow-hidden"
              whileHover={{ scale: 1.05, borderColor: "rgba(34, 197, 94, 1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative flex items-center gap-2">
                <span>Explore Features</span>
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  console.log("File selected:", file.name)
                }
              }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, staggerChildren: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-6 rounded-xl backdrop-blur-xl border border-cyan-400/20 overflow-hidden cursor-pointer"
                whileHover={{ y: -10, borderColor: "rgba(34, 197, 94, 0.6)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-700/50"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                  whileHover={{ opacity: 0.2 }}
                />
                <div className="relative flex flex-col items-center gap-4">
                  <motion.div
                    className={`p-4 rounded-lg bg-gradient-to-br ${feature.color}`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-lg font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {feature.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="relative" variants={floatingCardVariants} animate="animate">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 rounded-3xl blur-3xl"
              variants={morphVariants}
              animate="animate"
            />
            <motion.div
              className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-cyan-400/30 backdrop-blur-2xl max-w-lg mx-auto overflow-hidden"
              whileHover={{ borderColor: "rgba(34, 197, 94, 0.8)", y: -5 }}
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 blur-lg -z-10"
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
              <div className="space-y-6">
                <motion.h3
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  How It Works
                </motion.h3>
                <div className="space-y-4">
                  {["Upload your report", "AI processes data", "Get instant insights"].map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4 items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center font-bold text-slate-950 flex-shrink-0"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                        transition={{ delay: i * 0.3, duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {i + 1}
                      </motion.div>
                      <span className="text-slate-300 font-medium">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="fixed pointer-events-none w-96 h-96 bg-cyan-400/10 rounded-full filter blur-3xl -z-5"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 3, mass: 0.2 }}
      />
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Background Effects */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
        <div className="absolute inset-0">
          <motion.div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-3xl" animate={{ x: [0, 50, 0], y: [0, 100, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full filter blur-3xl" animate={{ x: [0, -60, 0], y: [0, -80, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl" animate={{ x: [0, 100, 0], y: [0, -100, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.3, duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
          {/* INFORMATION BLOGS */}
          {infoBlogs.length > 0 && (
            <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">Blogs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{infoBlogs.map(renderBlogCard)}</div>
            </motion.div>
          )}

          {/* HEALTH TIPS BLOGS */}
          {healthTipsBlogs.length > 0 && (
            <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
              <h2 className="text-4xl font-bold text-green-400 mb-4">Health Tips</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{healthTipsBlogs.map(renderBlogCard)}</div>
            </motion.div>
          )}

          {/* STORY BLOGS */}
          {storyBlogs.length > 0 && (
            <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
              <h2 className="text-4xl font-bold text-pink-400 mb-4">Stories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{storyBlogs.map(renderBlogCard)}</div>
            </motion.div>
          )}
        </div>

        {/* Blog Popup */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded shadow-md w-full max-w-lg relative overflow-y-auto max-h-[80vh]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
                  onClick={() => setSelectedBlog(null)}
                >
                  ×
                </button>

                {selectedBlog.image?.data && (
                  <img
                    src={`data:${selectedBlog.image.contentType};base64,${btoa(
                      String.fromCharCode(...new Uint8Array(selectedBlog.image.data.data))
                    )}`}
                    alt={selectedBlog.title}
                    className="w-full h-60 object-cover rounded mb-4"
                  />
                )}

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  {selectedBlog.title}
                  <span className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${star <= Math.round(selectedBlog.avgRating || selectedBlog.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-700 text-lg">
                      ({selectedBlog.avgRating || selectedBlog.rating || 0})
                    </span>
                  </span>
                </h2>

                <p className="text-gray-500 mb-2">
                  Posted on: {new Date(selectedBlog.date).toLocaleString()}
                </p>
                <p className="text-gray-500 mb-2">By: {selectedBlog.userId || "Anonymous"}</p>

                <div
                  className="blog-content mb-4"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeQuillHtml(selectedBlog.description),
                  }}
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Comments</h3>

                  {isAuthenticated ? (
                    <form onSubmit={handleCommentSubmit} className="mb-4 space-y-2">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full border rounded px-3 py-2"
                      />
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setCommentRating(star)}
                            className={`cursor-pointer text-2xl ${star <= commentRating ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Submit
                      </button>
                    </form>
                  ) : (
                    <p className="text-gray-500 mb-4">
                      Please <span className="font-semibold">login</span> to comment or rate.
                    </p>
                  )}

                  {/* Comments list */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {comments.length === 0 && <p className="text-gray-400">No comments yet</p>}
                    {comments.map((c) => (
                      <div key={c.commentId} className="border-b pb-2">
                        <p className="font-semibold">{c.userName}</p>
                        {c.text && <p>{c.text}</p>}
                        {c.rating != null && <p>⭐ {c.rating}</p>}
                        <p className="text-gray-400 text-sm">{new Date(c.date).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
